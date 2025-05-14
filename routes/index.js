/*
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

// Mostrar index
router.get('/', (req, res) => {
    console.log('Accediendo a la ruta /');
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// Mostrar about
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

// Mostrar contact
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

// Mostrar busqueda
router.get('/busqueda', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'busqueda.html'));
});

// Mostrar favoritos
router.get('/favoritos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'favoritos.html'));
});

// Mostrar formulario para registrar mascota
router.get('/mascotas/registermascota', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'mascota.html'));
});

// Procesar registro de mascota
router.post('/mascotas/registermascota', (req, res) => {
    const { idcentro, nombre, tamanio, especie, edad, genero, descripcion } = req.body;

    const sql = 'INSERT INTO mascota (idcentro, nombre, tamanio, especie, edad, genero, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombre, tamanio, especie, edad, genero, descripcion], (err, result) => {
        if (err) {
            console.error('Error al registrar mascota:', err);
            res.json({ success: false, message: 'Error al registrar mascota' });
            return;
        }
        const newId = result.insertId;
        res.json({ success: true, message: 'Mascota registrada exitosamente', idmascota: newId });
    });
});

// Obtener mascotas
router.get('/mascotas', (req, res) => {
    const sql = 'SELECT * FROM mascota';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            res.json({ success: false, message: 'Error al obtener mascotas' });
            return;
        }
        res.json({ success: true, mascotas: results });
    });
});
// Buscar refugios
router.get('/busqueda/refugios', (req, res) => {
    console.log('Ruta /busqueda/refugios accedida');
    const { nombre } = req.query;
    console.log('Parámetro nombre:', nombre);
    if (!nombre) {
        console.log('Falta parámetro nombre');
        return res.json({ success: false, message: 'Debe proporcionar un nombre para buscar' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE nombrecentro LIKE ?';
    const queryParam = `%${nombre}%`;
    console.log('Consulta SQL (refugios):', sql, 'con parámetro:', queryParam);
    db.query(sql, [queryParam], (err, results) => {
        if (err) {
            console.error('Error al buscar refugios:', err);
            return res.json({ success: false, message: 'Error al buscar refugios: ' + err.message });
        }
        console.log('Resultados de refugios:', results);
        res.json({ success: true, refugios: results });
    });
});

// Buscar mascotas
router.get('/busqueda/mascotas', (req, res) => {
    console.log('Ruta /busqueda/mascotas accedida');
    const { termino } = req.query;
    console.log('Parámetro termino:', termino);
    if (!termino) {
        console.log('Falta parámetro termino');
        return res.json({ success: false, message: 'Debe proporcionar un término para buscar' });
    }

    const sql = 'SELECT * FROM mascota WHERE nombre LIKE ? OR especie LIKE ?';
    const queryParams = [`%${termino}%`, `%${termino}%`];
    console.log('Consulta SQL (mascotas):', sql, 'con parámetros:', queryParams);
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error('Error al buscar mascotas:', err);
            return res.json({ success: false, message: 'Error al buscar mascotas: ' + err.message });
        }
        console.log('Resultados de mascotas:', results);
        res.json({ success: true, mascotas: results });
    });
});

// Mostrar página de detalles del refugio
router.get('/refugios/refugio', (req, res) => {
    console.log('Accediendo a la ruta /refugios/refugio');
    res.sendFile(path.join(__dirname, '../views', 'refugio.html'));
});

// Obtener detalles de todos los refugios
router.get('/refugios/refugios', (req, res) => {
    console.log('Ruta /refugios/refugios accedida');
    const sql = 'SELECT * FROM centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener refugios:', err);
            res.json({ success: false, message: 'Error al obtener refugios: ' + err.message });
            return;
        }
        console.log('Resultados de refugios:', results);
        res.json({ success: true, refugios: results });
    });
});

// Obtener mascotas de un refugio específico
router.get('/refugios/mascotas/:idcentro', (req, res) => {
    console.log('Ruta /refugios/mascotas/:idcentro accedida');
    const { idcentro } = req.params;
    console.log('Parámetro idcentro:', idcentro);
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas del refugio:', err);
            res.json({ success: false, message: 'Error al obtener mascotas: ' + err.message });
            return;
        }
        console.log('Resultados de mascotas:', results);
        res.json({ success: true, mascotas: results });
    });
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

// Rutas generales
router.get('/', (req, res) => {
    console.log('Accediendo a la ruta /');
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

router.get('/busqueda', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'busqueda.html'));
});

router.get('/favoritos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'favoritos.html'));
});

// Buscar refugios
router.get('/busqueda/refugios', (req, res) => {
    console.log('Ruta /busqueda/refugios accedida');
    const { nombre } = req.query;
    if (!nombre) {
        console.log('Falta parámetro nombre');
        return res.json({ success: false, message: 'Debe proporcionar un nombre para buscar' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE nombrecentro LIKE ?';
    const queryParam = `%${nombre}%`;
    console.log('Consulta SQL (refugios):', sql, 'con parámetro:', queryParam);
    db.query(sql, [queryParam], (err, results) => {
        if (err) {
            console.error('Error al buscar refugios:', err);
            return res.json({ success: false, message: 'Error al buscar refugios: ' + err.message });
        }
        console.log('Resultados de refugios:', results);
        res.json({ success: true, refugios: results });
    });
});

// Buscar mascotas
router.get('/busqueda/mascotas', (req, res) => {
    console.log('Ruta /busqueda/mascotas accedida');
    const { termino } = req.query;
    if (!termino) {
        console.log('Falta parámetro termino');
        return res.json({ success: false, message: 'Debe proporcionar un término para buscar' });
    }

    const sql = 'SELECT * FROM mascota WHERE nombre LIKE ? OR especie LIKE ?';
    const queryParams = [`%${termino}%`, `%${termino}%`];
    console.log('Consulta SQL (mascotas):', sql, 'con parámetros:', queryParams);
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error('Error al buscar mascotas:', err);
            return res.json({ success: false, message: 'Error al buscar mascotas: ' + err.message });
        }
        console.log('Resultados de mascotas:', results);
        res.json({ success: true, mascotas: results });
    });
});

module.exports = router;