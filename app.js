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
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./config/database'); 

const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const refugiosRoutes = require('./routes/refugios');
const mascotasRoutes = require('./routes/mascotas');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://tikapawdbp.onrender.com', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Sesiones persistentes
const sequelize = db.sequelize;
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
    checkExpirationInterval: 15 * 60 * 1000, // Cada 15 minutos limpia sesiones vencidas
    expiration: 24 * 60 * 60 * 1000           // Sesiones expiran en 24h
});

// Configurar cookieParser
app.use(cookieParser());

// Configurar sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi-secreto', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: 'None', // Asegura que la cookie funcione en sitios cruzados
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        path: '/'
    }
}));

// Rutas
app.use('/', indexRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/refugios', refugiosRoutes);
app.use('/mascotas', mascotasRoutes);
app.use('/solicitudes', solicitudesRoutes);

// Iniciar servidor
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos verificada');
        await sessionStore.sync(); 
        console.log('Tabla de sesiones sincronizada');

        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
})();
