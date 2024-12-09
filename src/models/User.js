const { DataTypes } = require('sequelize');
const sequelize = require('./database');

// Modelo de Usuario
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // El correo debe ser único
        validate: {
            isEmail: true // Validación de formato
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // La contraseña es obligatoria
    },
    role: {
        type: DataTypes.ENUM('Usuario', 'Administrador'), // Solo permite estos valores
        allowNull: false,
        defaultValue: 'Usuario' // Valor predeterminado al crear un usuario
    }
});

module.exports = User;
