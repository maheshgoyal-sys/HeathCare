const { Doctor, Patient, Mapping } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['name', 'specialization', 'email', 'phone'];

exports.getMine = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ where: { createdBy: req.user.id } });
  if (!doctor) throw new AppError('Doctor profile not found', 404);
  res.json({ success: true, data: doctor });
});

exports.updateMine = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ where: { createdBy: req.user.id } });
  if (!doctor) throw new AppError('Doctor profile not found', 404);
  await doctor.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Doctor profile updated', data: doctor });
});

exports.getAssignedToMe = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { userId: req.user.id } });
  if (!patient) throw new AppError('Patient profile not found', 404);

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [{ model: Doctor, as: 'doctor' }],
    order: [['createdAt', 'DESC']],
  });
  res.json({
    success: true,
    count: mappings.length,
    data: mappings.map((mapping) => ({ mappingId: mapping.id, ...mapping.doctor.toJSON() })),
  });
});

const findDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
};

const findOwnedDoctor = async (id, user) => {
  const doctor = await findDoctor(id);
  if (user.role !== 'other' && doctor.createdBy !== user.id) {
    throw new AppError('You are not allowed to modify this doctor', 403);
  }
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
  const doctor = await findOwnedDoctor(req.params.id, req.user);
  await doctor.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Doctor updated', data: doctor });
});

exports.remove = asyncHandler(async (req, res) => {
  const doctor = await findOwnedDoctor(req.params.id, req.user);
  await doctor.destroy();
  res.json({ success: true, message: 'Doctor deleted' });
});