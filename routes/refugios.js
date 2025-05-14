/*
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');

// mostrar formulario para registro
router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

// procesar registro de refugios
router.post('/registerrefugio', (req, res) => {
    const { nombreencargado, nombrecentro, telefono, correo, redesociales, contrasena } = req.body;
    const adopcion = true;

    const sql = 'INSERT INTO centrosdeadopcion (nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena || '123', redesociales], (err, result) => {
        if (err) {
            console.error('error al registrar refugio:', err);
            res.json({ success: false, message: 'error al registrar refugio' });
            return;
        }
        const newId = result.insertId; // ID generado por MySQL
        res.json({ success: true, message: 'refugio registrado exitosamente', idcentro: newId });
    });
});

// mostrar lista de refugios
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugios.html'));
});

// obtener refugios
router.get('/refugios', (req, res) => {
    const sql = 'SELECT * FROM centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('error al obtener refugios:', err);
            res.json({ success: false, message: 'error al obtener refugios' });
            return;
        }
        res.json({ success: true, refugios: results });
    });
});

// obtener mascotas por refugio
router.get('/mascotas/:idcentro', (req, res) => {
    const idcentro = req.params.idcentro;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('error al obtener mascotas del refugio:', err);
            res.json({ success: false, message: 'error al obtener mascotas' });
            return;
        }
        res.json({ success: true, mascotas: results });
    });
});

// mostrar refugio especifico
router.get('/refugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugio.html'));
});

module.exports = router;
*/
/*
const express = require('express');
const router = express.Router();
const path = require('path');
//const multer = require('multer');
const db = require('../config/database');

// Mostrar formulario para registrar refugio
router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

// Procesar registro de refugios
router.post('/registerrefugio', (req, res) => {
    const { nombreencargado, nombrecentro, telefono, correo, redesociales, contrasena } = req.body;
    const adopcion = true;

    // SQL para insertar refugio en la base de datos
    const sql = 'INSERT INTO centrosdeadopcion (nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena || '123', redesociales], (err, result) => {
        if (err) {
            console.error('Error al registrar refugio:', err);
            return res.json({ success: false, message: 'Error al registrar refugio' });
        }
        const newId = result.insertId; // ID generado por MySQL
        res.json({ success: true, message: 'Refugio registrado exitosamente', idcentro: newId });
    });
});

// Mostrar lista de refugios
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugios.html'));
});

// Obtener todos los refugios
router.get('/refugios', (req, res) => {
    const sql = 'SELECT * FROM centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener refugios:', err);
            return res.json({ success: false, message: 'Error al obtener refugios' });
        }
        res.json({ success: true, refugios: results });
    });
});

router.get('/refugio', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/refugio.html'));
});


// Obtener mascotas por refugio
router.get('/mascotas/:idcentro', (req, res) => {
    const idcentro = req.params.idcentro;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas del refugio:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

// Login para refugios
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    // Buscar en tabla de refugios
    const sqlRefugio = 'SELECT idcentro, nombrecentro FROM centrosdeadopcion WHERE correo = ? AND contrasena = ?';
    db.query(sqlRefugio, [correo, password], (err, resultsRefugio) => {
        if (err) {
            console.error('Error al iniciar sesión (refugio):', err);
            return res.json({ success: false, message: 'Error del servidor' });
        }

        if (resultsRefugio.length > 0) {
            const refugio = resultsRefugio[0];
            req.session.userId = refugio.idcentro;
            req.session.tipo = 'refugio';
            return res.json({ success: true, tipo: 'refugio' });  // Esto ya está bien
        }

        return res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    });
});

// Ruta para ver el perfil de refugio, redirige si no está autenticado
router.get('/perfil/refugio', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login'); // Redirige si no está autenticado
    }
    res.sendFile(path.join(__dirname, '../views', 'perfilRefugio.html')); // Enviar la vista del perfil
});

// Obtener el perfil del refugio a través de una API (JSON)
router.get('/api/perfil', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.json({ success: false, message: 'Debe iniciar sesión como refugio' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE idcentro = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error al obtener perfil de refugio:', err);
            return res.json({ success: false, message: 'Error al obtener perfil' });
        }
        if (results.length > 0) {
            res.json({ success: true, refugio: results[0] });
        } else {
            res.json({ success: false, message: 'No se encontró el refugio' });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
        res.json({ success: true, message: 'Sesión cerrada exitosamente' }); // Respuesta al frontend
    });
});


// Ruta para registrar mascotas (debe estar protegida)
router.post('/mascotas/register', (req, res) => {
    // Verificar sesión de refugio
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const { nombre, tamanio, especie, edad, genero, descripcion } = req.body;
    const idcentro = req.session.userId; // Usar el ID del refugio de la sesión

    const sql = 'INSERT INTO mascota (idcentro, nombre, tamanio, especie, edad, genero, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombre, tamanio, especie, edad, genero, descripcion], (err, result) => {
        if (err) {
            console.error('Error al registrar mascota:', err);
            return res.json({ success: false, message: 'Error al registrar mascota' });
        }
        res.json({ success: true, message: 'Mascota registrada exitosamente' });
    });
});

router.get('/mascotas/:idcentro', (req, res) => {
    const idcentro = req.params.idcentro;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../config/database');

//cargado de imagenes , se guarda en ./uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Mostrar formulario para registrar refugio
router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

// Procesar registro de refugios
router.post('/registerrefugio', (req, res) => {
    const { nombreencargado, nombrecentro, telefono, correo, redesociales, contrasena } = req.body;
    const adopcion = true;

    // SQL para insertar refugio en la base de datos
    const sql = 'INSERT INTO centrosdeadopcion (nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena || '123', redesociales], (err, result) => {
        if (err) {
            console.error('Error al registrar refugio:', err);
            return res.json({ success: false, message: 'Error al registrar refugio' });
        }
        const newId = result.insertId; // ID generado por MySQL
        res.json({ success: true, message: 'Refugio registrado exitosamente', idcentro: newId });
    });
});

// Mostrar lista de refugios
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugios.html'));
});

// Obtener todos los refugios
router.get('/refugios', (req, res) => {
    const sql = 'SELECT * FROM centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener refugios:', err);
            return res.json({ success: false, message: 'Error al obtener refugios' });
        }
        res.json({ success: true, refugios: results });
    });
});

router.get('/refugio', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/refugio.html'));
});


// Obtener mascotas por refugio
router.get('/mascotas/:idcentro', (req, res) => {
    const idcentro = req.params.idcentro;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas del refugio:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

// Login para refugios
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    // Buscar en tabla de refugios
    const sqlRefugio = 'SELECT idcentro, nombrecentro FROM centrosdeadopcion WHERE correo = ? AND contrasena = ?';
    db.query(sqlRefugio, [correo, password], (err, resultsRefugio) => {
        if (err) {
            console.error('Error al iniciar sesión (refugio):', err);
            return res.json({ success: false, message: 'Error del servidor' });
        }

        if (resultsRefugio.length > 0) {
            const refugio = resultsRefugio[0];
            req.session.userId = refugio.idcentro;
            req.session.tipo = 'refugio';
            return res.json({ success: true, tipo: 'refugio' });  // Esto ya está bien
        }

        return res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    });
});

// Ruta para ver el perfil de refugio, redirige si no estaa autenticado
router.get('/perfil/refugio', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login'); 
    }
    res.sendFile(path.join(__dirname, '../views', 'perfilRefugio.html')); 
});

// Obtener el perfil del refugio a través de una API (JSON)
router.get('/api/perfil', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.json({ success: false, message: 'Debe iniciar sesión como refugio' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE idcentro = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error al obtener perfil de refugio:', err);
            return res.json({ success: false, message: 'Error al obtener perfil' });
        }
        if (results.length > 0) {
            res.json({ success: true, refugio: results[0] });
        } else {
            res.json({ success: false, message: 'No se encontró el refugio' });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesionn
        res.json({ success: true, message: 'Sesión cerrada exitosamente' }); 
    });
});


router.post('/mascotas/register', upload.single('foto'), (req, res) => {
    const { nombre, tamanio, especie, edad, genero, descripcion, idcentro } = req.body;
    const foto = req.file ? req.file.filename : null;
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!nombre || !tamanio || !especie || !edad || !genero || !descripcion || !idcentro) {
        return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    // SQL sin promesas, con callback
    const sql = 'INSERT INTO mascota (nombre, tamanio, especie, edad, genero, descripcion, idcentro, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, tamanio, especie, edad, genero, descripcion, idcentro, foto], (err, result) => {
        if (err) {
            console.error('Error al registrar mascota:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true });
    });
});

router.get('/mascotas', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const idcentro = req.session.userId;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';

    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

router.get('/registermascota', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login'); // redirige si no estaa logueado
    }
    res.sendFile(path.join(__dirname, '../views/registermascota.html'));
});

router.get('/api/auth/check', (req, res) => {
    if (req.session.userId && req.session.tipo) {
        res.json({ isValid: true, tipo: req.session.tipo, userId: req.session.userId });
    } else {
        res.json({ isValid: false });
    }
});


module.exports = router;