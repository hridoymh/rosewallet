const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Ensure this points to your database configuration

const Purchase = db.define('Purchase', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING, // 'pending' or 'confirmed'
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Purchase;
