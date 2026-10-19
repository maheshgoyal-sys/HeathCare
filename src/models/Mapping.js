// src/models/Mapping.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mapping = sequelize.define('Mapping', {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'mappings',
  indexes: [{ unique: true, fields: ['patientId', 'doctorId'] }],
});

module.exports = Mapping;