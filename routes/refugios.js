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