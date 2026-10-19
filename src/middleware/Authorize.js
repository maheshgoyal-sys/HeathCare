const AppError = require('../utils/AppError');

module.exports = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You are not allowed to access this resource', 403));
  }
  return next();
};