const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Item extends Model {}

Item.init({
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Item' });

module.exports = Item;
