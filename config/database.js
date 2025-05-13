require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'aliceg',
    database: process.env.DB_DATABASE || 'dbtikapaw'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.code, err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;
