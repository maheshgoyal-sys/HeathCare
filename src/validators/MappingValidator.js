const { body } = require('express-validator');

exports.createMappingRules = [
  body('patientId').isInt({ min: 1 }).withMessage('patientId must be a positive integer').toInt(),
  body('doctorId').isInt({ min: 1 }).withMessage('doctorId must be a positive integer').toInt(),
];