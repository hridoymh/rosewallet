const { Sequelize } = require('sequelize');
const path = require('path');

// Define the path for the SQLite database file
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'), // Database file located in the root directory
    logging: false // Optional: disable logging for a cleaner console output
});

module.exports = sequelize;
