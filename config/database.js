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