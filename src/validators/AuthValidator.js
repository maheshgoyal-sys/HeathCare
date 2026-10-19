const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('password is required'),
];