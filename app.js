/*
const express = require('express'); // servidor
const bodyParser = require('body-parser'); // datos
//const mysql = require('mysql2'); 
const path = require('path');
const db = require('./config/database');
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');//n
const refugiosRoutes = require('./routes/refugios');//n

const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes); //n
app.use('/refugios', refugiosRoutes); //n

// iniciar servidor
app.listen(port, () => {
    console.log('servidor corriendo en http://localhost:' + port);
});
*/
const express = require('express');
const session = require('express-session'); 
const path = require('path');

// Rutas
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const refugiosRoutes = require('./routes/refugios');

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Configuración seesion
app.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true 
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/refugios', refugiosRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});