/*

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aliceg', 
    database: 'dbtikapaw' 
});

db.connect((err) => {
    if (err) {
        console.error('error conectando a la base de datos:', err);
        return;
    }
    console.log('conectado a la base de datos mysql');
});

module.exports = db;
*/
require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'aliceg',
    database: process.env.DB_DATABASE || 'dbtikapaw',
    //port: process.env.DB_PORT || 3306
    port: process.env.DB_PORT || 32803
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.code, err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;