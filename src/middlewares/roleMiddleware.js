// Middleware para verificar el rol del usuario
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (role !== requiredRole) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
        }

        next(); // Si el rol es correcto, continúa
    };
};

module.exports = authorizeRole;
