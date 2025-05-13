/*
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');

let ultimo_id_usuario = 0;

// mostrar formulario de registro de usuarios
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

// procesar registro de usuarios
router.post('/register', (req, res) => {
    const { nombre, edad, correo, telefono, password } = req.body;
    ultimo_id_usuario += 1;
    const idusuario = ultimo_id_usuario;
    const sql = 'insert into usuario (idusuario, nombre, edad, correo, telefono, clave) values (?, ?, ?, ?, ?, ?)';

    db.query(sql, [idusuario, nombre, edad, correo, telefono, password], (err, result) => {
        if (err) {
            console.error('error al registrar usuario:', err);
            res.json({ success: false, message: 'error al registrar usuario' });
            return;
        }
        res.json({ success: true, message: 'usuario registrado exitosamente' });
    });
});

// mostrar formulario de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// procesar login
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    const sql = 'select * from usuario where correo = ? and clave = ?';
    db.query(sql, [correo, password], (err, results) => {
        if (err) {
            console.error('error al iniciar sesion:', err);
            res.json({ success: false, message: 'error al iniciar sesion' });
            return;
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'inicio exitoso :d' });
        } 
        else {
            res.json({ success: false, message: 'correo o contraseña incorrecta' });
        }
    });
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');


// mostrar formulario de registro de usuarios
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

// procesar registro de usuarios
router.post('/register', (req, res) => {
    const { nombre, edad, correo, telefono, password } = req.body;
    
    const sql = 'insert into usuario ( nombre, edad, correo, telefono, contrasena) values ( ?, ?, ?, ?, ?)';

    db.query(sql, [ nombre, edad, correo, telefono, password], (err, result) => {
        if (err) {
            console.error('error al registrar usuario:', err);
            res.json({ success: false, message: 'error al registrar usuario' });
            return;
        }
        res.json({ success: true, message: 'usuario registrado exitosamente' });
    });
});

// mostrar formulario de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// procesar login
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    const sql = 'select * from usuario where correo = ? and contrasena = ?';
    db.query(sql, [correo, password], (err, results) => {
        if (err) {
            console.error('error al iniciar sesion:', err);
            res.json({ success: false, message: 'error al iniciar sesion' });
            return;
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'inicio exitoso :d' });
        } 
        else {
            res.json({ success: false, message: 'correo o contraseña incorrecta' });
        }
    });
});

module.exports = router;