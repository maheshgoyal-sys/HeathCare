
const sequelize = require('../config/db');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

User.hasMany(Patient, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasOne(Patient, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'account' });

User.hasMany(Doctor, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Patient.hasMany(Mapping, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Doctor.hasMany(Mapping, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Mapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };