const { Doctor } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['name', 'specialization', 'email', 'phone'];

const findDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
};

const findOwnedDoctor = async (id, userId) => {
  const doctor = await findDoctor(id);
  if (doctor.createdBy !== userId) throw new AppError('You are not allowed to modify this doctor', 403);
  return doctor;
};

exports.create = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create({ ...pick(req.body, FIELDS), createdBy: req.user.id });
  res.status(201).json({ success: true, message: 'Doctor created', data: doctor });
});

exports.getAll = asyncHandler(async (req, res) => {
  const doctors = await Doctor.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ success: true, count: doctors.length, data: doctors });
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await findDoctor(req.params.id) });
});

exports.update = asyncHandler(async (req, res) => {
  const doctor = await findOwnedDoctor(req.params.id, req.user.id);
  await doctor.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Doctor updated', data: doctor });
});

exports.remove = asyncHandler(async (req, res) => {
  const doctor = await findOwnedDoctor(req.params.id, req.user.id);
  await doctor.destroy();
  res.json({ success: true, message: 'Doctor deleted' });
});