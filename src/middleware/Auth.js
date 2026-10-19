const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch (e) {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email', 'role'] });
  if (!user) throw new AppError('User no longer exists', 401);

  req.user = user;
  next();
});