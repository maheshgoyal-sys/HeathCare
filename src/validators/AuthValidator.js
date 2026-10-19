const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
  body('role').isIn(['patient', 'doctor', 'other']).withMessage('role must be patient, doctor or other'),
  body('age').if(body('role').equals('patient')).isInt({ min: 0, max: 150 }).withMessage('valid patient age is required').toInt(),
  body('gender').if(body('role').equals('patient')).isIn(['male', 'female', 'other']).withMessage('valid patient gender is required'),
  body('specialization').if(body('role').equals('doctor')).trim().notEmpty().withMessage('doctor specialization is required'),
  body('phone').optional().matches(/^[0-9+\-\s]{7,15}$/).withMessage('invalid phone number'),
  body('staffCode').if(body('role').equals('other')).notEmpty().withMessage('staffCode is required for other accounts'),
  body('disease').optional().isString().trim(),
];

exports.loginRules = [
  body('email').isEmail().withMessage('valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('password is required'),
];