const loginAttempts = {}; // Guardará los intentos por correo

const loginLimiter = (req, res, next) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Correo electrónico requerido' });

    if (!loginAttempts[email]) loginAttempts[email] = { attempts: 0, blocked: false, lastAttempt: null };

    const userAttempts = loginAttempts[email];

    // Bloqueo temporal (5 minutos)
    if (userAttempts.blocked && Date.now() - userAttempts.lastAttempt < 5 * 60 * 1000) {
        return res.status(429).json({ message: 'Demasiados intentos fallidos. Intenta más tarde.' });
    }

    // Si el usuario no está bloqueado, continúa
    userAttempts.blocked = false;
    next();
};

const recordFailedLogin = (email) => {
    if (!loginAttempts[email]) loginAttempts[email] = { attempts: 0, blocked: false, lastAttempt: null };

    const userAttempts = loginAttempts[email];
    userAttempts.attempts += 1;
    userAttempts.lastAttempt = Date.now();

    // Bloquea al usuario después de 5 intentos fallidos
    if (userAttempts.attempts >= 5) {
        userAttempts.blocked = true;
    }
};

const resetLoginAttempts = (email) => {
    if (loginAttempts[email]) {
        loginAttempts[email].attempts = 0;
        loginAttempts[email].blocked = false;
    }
};

module.exports = { loginLimiter, recordFailedLogin, resetLoginAttempts };
