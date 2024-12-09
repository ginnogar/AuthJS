const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Para trabajar con JWT
const authenticateToken = require('../middlewares/authMiddleware'); // Importar el middleware de autenticacion de token
const authorizeRole = require('../middlewares/roleMiddleware'); // Importar el middleware de roles
const { loginLimiter, recordFailedLogin, resetLoginAttempts } = require('../middlewares/loginLimiter');


const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica si ya existe un usuario con el mismo correo
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'El correo ya está registrado' });

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta para iniciar sesión
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            recordFailedLogin(email); // Registra el intenti fallido
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verifica si la contraseña es correcta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            recordFailedLogin(email); // Registra el intento fallido
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        resetLoginAttempts(email); // Restablece los intentos si el inicio de sesión es exitoso

        // Genera un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, // Datos a incluir en el token
            process.env.JWT_SECRET,           // Clave secreta
            { expiresIn: '1h' }               // Duración del token
        );

        // Establecer el token en una cookie segura
        res.cookie('token', token, {
            httpOnly: true,  // Evita que el cliente acceda a la cookie
            secure: false,   // Cambia a true en HTTPS
            maxAge: 3600000  // Expira en 1 hora
        }).status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta protegida por autenticación
router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Acceso permitido', user: req.user });
});

// Ruta solo accesible para Administradores
router.get('/admin', authenticateToken, authorizeRole('Administrador'), (req, res) => {
    res.status(200).json({ message: 'Acceso permitido. Bienvenido, Administrador.' });
});

// Ruta accesible para cualquier usuario autenticado
router.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Bienvenido al panel de usuario', user: req.user });
});

module.exports = router;
