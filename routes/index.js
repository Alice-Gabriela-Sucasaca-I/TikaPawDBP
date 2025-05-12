const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

let ultimo_id_mascota = 0;

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
    const { nombre, tamanio, especie, edad, genero, descripcion } = req.body;

    ultimo_id_mascota += 1;
    const idmascota = ultimo_id_mascota;

    const sql = 'INSERT INTO mascota (idmascota, nombre, tamanio, especie, edad, genero, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idmascota, nombre, tamanio, especie, edad, genero, descripcion], (err, result) => {
        if (err) {
            console.error('error al registrar mascota:', err);
            res.json({ success: false, message: 'error al registrar mascota' });
            return;
        }
        res.json({ success: true, message: 'mascota registrada exitosamente' });
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