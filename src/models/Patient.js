const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 150 } },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
  disease: { type: DataTypes.STRING },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, unique: true },
}, { tableName: 'patients' });

module.exports = Patient;