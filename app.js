const express = require('express'); // servidor
const bodyParser = require('body-parser'); // datos
//const mysql = require('mysql2'); 
const path = require('path');
const db = require('./config/database');
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const refugiosRoutes = require('./routes/refugios');

const app = express();
const port = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/refugios', refugiosRoutes);

// iniciar servidor
app.listen(port, () => {
    console.log('servidor corriendo en http://localhost:' + port);
});