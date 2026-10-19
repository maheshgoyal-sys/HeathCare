const { body } = require('express-validator');
const { field } = require('./common');

exports.patientRules = (isUpdate = false) => [
  field('name', isUpdate).trim().notEmpty().withMessage('name is required'),
  field('age', isUpdate).isInt({ min: 0, max: 150 }).withMessage('age must be between 0 and 150'),
  field('gender', isUpdate).isIn(['male', 'female', 'other']).withMessage('gender must be male, female or other'),
  body('disease').optional().isString().trim(),
];