/*const express = require('express');

const router = express.Router();
const db = require('../config/database');
const path = require('path');

let ultimo_id_centro = 0;

// mostrar formulario para registro
router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

// procesar registro de refugios
router.post('/registerrefugio', (req, res) => {
    const { rubro, nombreencargado, nombrecentro, telefono, correo, redesociales, descripcion, contrasena } = req.body;
    const adopcion = true;

    ultimo_id_centro += 1;
    const idcentro = ultimo_id_centro;

    const sql = 'insert into centrosdeadopcion (idcentro, nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) values (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales], (err, result) => {
        if (err) {
            console.error('error al registrar refugio:', err);
            res.json({ success: false, message: 'error al registrar refugio' });
            return;
        }
        res.json({ success: true, message: 'refugio registrado exitosamente' });
    });
});

// mostrar lista de refugios
router.get('/', (req, res) => {
    const sql = 'select * from centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('error al obtener refugios:', err);
            res.send('error al cargar refugios');
            return;
        }
        res.sendFile(path.join(__dirname, '../views', 'refugios.html'));
    });
});

// mostrar refugio especifico
router.get('/refugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugio.html'));
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');

let ultimo_id_centro = 0;

// mostrar formulario para registro
router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

// procesar registro de refugios
router.post('/registerrefugio', (req, res) => {
    const { rubro, nombreencargado, nombrecentro, telefono, correo, redesociales, contrasena } = req.body;
    const adopcion = true;

    ultimo_id_centro += 1;
    const idcentro = ultimo_id_centro;

    const sql = 'INSERT INTO centrosdeadopcion (idcentro, nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena || '123', redesociales], (err, result) => {
        if (err) {
            console.error('error al registrar refugio:', err);
            res.json({ success: false, message: 'error al registrar refugio' });
            return;
        }
        res.json({ success: true, message: 'refugio registrado exitosamente' });
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