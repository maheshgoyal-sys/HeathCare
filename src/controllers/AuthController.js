const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Patient, Doctor } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, age, gender, disease, specialization, phone, staffCode } = req.body;

  if (role === 'other' && (!process.env.STAFF_REGISTRATION_CODE || staffCode !== process.env.STAFF_REGISTRATION_CODE)) {
    throw new AppError('Invalid staff registration code', 403);
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, 10);
  const transaction = await sequelize.transaction();
  let user;
  let profile;

  try {
    user = await User.create({ name, email, password: hashed, role }, { transaction });

    if (role === 'patient') {
      profile = await Patient.create({
        name,
        age,
        gender,
        disease,
        createdBy: user.id,
        userId: user.id,
      }, { transaction });
    } else if (role === 'doctor') {
      profile = await Doctor.create({
        name,
        specialization,
        email,
        phone,
        createdBy: user.id,
      }, { transaction });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { id: user.id, name: user.name, email: user.email, role: user.role, profile },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
  });
});