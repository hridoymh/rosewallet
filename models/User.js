const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tokenBalance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // Default role is 'user'
    },
});

module.exports = User;
