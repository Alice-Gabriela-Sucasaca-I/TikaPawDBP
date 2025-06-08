/*
const express = require('express');
const session = require('express-session'); 
const path = require('path');
const db = require('./config/database');
const cors = require('cors');
// Rutas
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const refugiosRoutes = require('./routes/refugios');
const mascotasRoutes = require('./routes/mascotas');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
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
app.use(express.static(path.join(__dirname, 'views')));
// Rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/refugios', refugiosRoutes);
app.use('/mascotas', mascotasRoutes);
//app.use('/', solicitudesRoutes);
app.use('/solicitudes', solicitudesRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
*/
// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');
const cors = require('cors');
const SequelizeStore = require('connect-session-sequelize')(session.Store); 

// Rutas
const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const refugiosRoutes = require('./routes/refugios');
const mascotasRoutes = require('./routes/mascotas');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();
const port = process.env.PORT || 3000; 


const sequelize = db.sequelize; 
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions', 
});

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'mi-secreto', 
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

sessionStore.sync();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/refugios', refugiosRoutes);
app.use('/mascotas', mascotasRoutes);
app.use('/solicitudes', solicitudesRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos verificada');

        const sessionStore = new SequelizeStore({
            db: sequelize, 
            tableName: 'sessions',
        });

        await sessionStore.sync();

    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
})();
