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