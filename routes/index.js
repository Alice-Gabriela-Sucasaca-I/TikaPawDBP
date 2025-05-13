const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

// mostrar index
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// mostrar about
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

// mostrar contact
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

// mostrar busqueda
router.get('/busqueda', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'busqueda.html'));
});

// mostrar favoritos
router.get('/favoritos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'favoritos.html'));
});

// mostrar formulario para registrar mascota
router.get('/mascotas/registermascota', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'mascota.html'));
});

// procesar registro de mascota

router.post('/mascotas/registermascota', (req, res) => {
    const { idcentro, nombre, tamanio, especie, edad, genero, descripcion } = req.body;

    const sql = 'INSERT INTO mascota (idcentro, nombre, tamanio, especie, edad, genero, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombre, tamanio, especie, edad, genero, descripcion], (err, result) => {
        if (err) {
            console.error('error al registrar mascota:', err);
            res.json({ success: false, message: 'error al registrar mascota' });
            return;
        }
        const newId = result.insertId; // ID generado por MySQL
        res.json({ success: true, message: 'mascota registrada exitosamente', idmascota: newId });
    });
});

// obtener mascotas
router.get('/mascotas', (req, res) => {
    const sql = 'SELECT * FROM mascota';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('error al obtener mascotas:', err);
            res.json({ success: false, message: 'error al obtener mascotas' });
            return;
        }
        res.json({ success: true, mascotas: results });
    });
});

module.exports = router;