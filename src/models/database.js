const { Sequelize } = require('sequelize');

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // Archivo donde se guardará la base de datos
});

module.exports = sequelize;
