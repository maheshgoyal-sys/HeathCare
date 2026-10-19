const { field } = require('./common');
const { body } = require('express-validator');

exports.doctorRules = (isUpdate = false) => [
  field('name', isUpdate).trim().notEmpty().withMessage('name is required'),
  field('specialization', isUpdate).trim().notEmpty().withMessage('specialization is required'),
  field('email', isUpdate).isEmail().withMessage('valid email is required').normalizeEmail(),
  body('phone').optional().matches(/^[0-9+\-\s]{7,15}$/).withMessage('invalid phone number'),
];