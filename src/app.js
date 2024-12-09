require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sequelize = require('./models/database'); // Conexión a la base de datos
const User = require('./models/User'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Para el hash de contraseñas
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const helmet = require('helmet'); // Para cabeceras de seguridad y protección básica contra XSS
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true }); // Middleware para manejar CSRF tokens

const app = express();

// Middlewares
app.use(bodyParser.json()); // Para leer el cuerpo de las solicitudes en formato JSON
app.use(cookieParser()); // Para manejar cookies
app.use('/auth', authRoutes); // Usar las rutas de autenticación con el prefijo /auth
app.use(helmet());
app.use(csrfProtection);

// Ruta para obtener el token CSRF
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Sincronizar base de datos al iniciar el servidor
sequelize.sync({ force: false }) // Sincroniza la base de datos, borrando y recreando tablas
    .then(async () => {
        console.log('Base de datos recreada con la nueva estructura');

        // Crear un usuario administrador si no existe
        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10); // Hashear la contraseña
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                role: 'Administrador'
            });
            console.log('Usuario administrador creado');
        } else {
            console.log('El administrador ya existe');
        }
    })
    .catch(err => console.error('Error al sincronizar la base de datos:', err));

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a PassPort!');
});

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
