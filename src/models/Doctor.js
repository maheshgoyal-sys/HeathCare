const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: { type: DataTypes.STRING },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'doctors' });

module.exports = Doctor;