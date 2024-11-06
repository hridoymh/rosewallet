const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Ensure this points to your database configuration

const Transaction = db.define('Transaction', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING, // 'credit' or 'debit'
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING, // 'completed' or 'pending'
        allowNull: false,
    },
    
}, {
    timestamps: true,
});

module.exports = Transaction;
