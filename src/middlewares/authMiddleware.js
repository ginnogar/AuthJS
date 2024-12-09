const jwt = require('jsonwebtoken');

// Middleware para validar tokens JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;

    if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

    // Verifica el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido o expirado' });

        req.user = user; // Guarda los datos del usuario en la solicitud
        next();          // Continúa con la siguiente función
    });
};

module.exports = authenticateToken;
