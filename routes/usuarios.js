const express = require('express');
const router = express.Router();
//const db = require('../config/database');
const { db } = require('../config/database');

const path = require('path');
const bcrypt = require('bcrypt'); 

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

router.post('/register', async (req, res) => {
    const { nombre, edad, correo, telefono, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO usuario (nombre, edad, correo, telefono, contrasena) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nombre, edad, correo, telefono, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.json({ success: false, message: 'Error al registrar usuario' });
            }
            res.json({ success: true, message: 'Usuario registrado exitosamente' });
        });
    } catch (error) {
        console.error('Error al encriptar contraseña:', error);
        res.json({ success: false, message: 'Error al procesar el registro' });
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

router.post('/login', async (req, res) => {
    if (req.session.userId) {
        return res.json({ success: true, tipo: req.session.tipo });
    }

    const { correo, password } = req.body;

    // Buscar en tabla de usuarios
    const sqlUsuario = 'SELECT idusuario, nombre, contrasena FROM usuario WHERE correo = ?';
    db.query(sqlUsuario, [correo], async (err, resultsUsuario) => {
        if (err) {
            console.error('Error al iniciar sesión (usuario):', err);
            return res.json({ success: false, message: 'Error del servidor' });
        }

        if (resultsUsuario.length > 0) {
            const usuario = resultsUsuario[0];
            const match = await bcrypt.compare(password, usuario.contrasena);
            if (match) {
                req.session.userId = usuario.idusuario;
                req.session.tipo = 'usuario';
                return res.json({ success: true, tipo: 'usuario' });
            }
        }

        // Buscar en tabla de refugios
        const sqlRefugio = 'SELECT idcentro, nombrecentro, contrasena FROM centrosdeadopcion WHERE correo = ?';
        db.query(sqlRefugio, [correo], async (err, resultsRefugio) => {
            if (err) {
                console.error('Error al iniciar sesión (refugio):', err);
                return res.json({ success: false, message: 'Error del servidor' });
            }

            if (resultsRefugio.length > 0) {
                const refugio = resultsRefugio[0];
                const match = await bcrypt.compare(password, refugio.contrasena);
                if (match) {
                    req.session.userId = refugio.idcentro;
                    req.session.tipo = 'refugio';
                    return res.json({ success: true, tipo: 'refugio' });
                }
            }

            return res.json({ success: false, message: 'Correo o contraseña incorrectos' });
        });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Sesión cerrada exitosamente' });
    });
});

router.get('/api/auth/check', (req, res) => {
    if (!req.session.userId || !req.session.tipo) {
        return res.json({ isValid: false });
    }

    const sql = 'SELECT idusuario, nombre, edad, correo, telefono FROM usuario WHERE idusuario = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ isValid: false });
        }
        const user = results[0];
        res.json({
            isValid: true,
            tipo: req.session.tipo,
            userId: user.idusuario,
            username: user.nombre,
            edad: user.edad,
            correo: user.correo,
            telefono: user.telefono
        });
    });
});

router.get('/perfil/usuario', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'usuario') {
        return res.redirect('/usuarios/login');
    }

    res.sendFile(path.join(__dirname, '../views', 'perfilUsuario.html'));
});

router.get('/perfil/usuario/datos', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'usuario') {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const sql = 'SELECT nombre, edad, correo, telefono FROM usuario WHERE idusuario = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error al obtener datos del usuario:', err);
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, data: results[0] });
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/login/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;

  const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">

  <rdf:Description rdf:about="${baseURL}/usuarios/login">
    <tiki:descripcion>Accede a tu cuenta o regístrate.</tiki:descripcion>
    <tiki:enlaceRegistrar rdf:resource="${baseURL}/usuarios/register"/>
    <tiki:yaTengoCuenta rdf:resource="${baseURL}/usuarios/login"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdf);
});

router.get('/register/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;

  const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">

  <rdf:Description rdf:about="${baseURL}/usuarios/register">
    <tiki:descripcion>Formulario para crear una cuenta de usuario.</tiki:descripcion>
    <tiki:yaTengoCuenta rdf:resource="${baseURL}/usuarios/login"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdf);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
