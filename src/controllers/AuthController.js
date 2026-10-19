const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: user.id, name: user.name, email: user.email },
  });
  exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: { token, user: { id: user.id, name: user.name, email: user.email } },
  });
});
});