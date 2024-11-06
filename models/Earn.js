const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Earn extends Model {}

Earn.init({
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  // quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Earn' });

module.exports = Earn;
