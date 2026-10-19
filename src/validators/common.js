const { body, param } = require('express-validator');

exports.idParam = (name = 'id') =>
  param(name).isInt({ min: 1 }).withMessage(`${name} must be a positive integer`).toInt();

// update me field optional ho jaata hai
exports.field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));