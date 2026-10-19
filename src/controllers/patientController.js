const { Patient, Doctor, Mapping } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['name', 'age', 'gender', 'disease'];

exports.getMine = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { userId: req.user.id } });
  if (!patient) throw new AppError('Patient profile not found', 404);
  res.json({ success: true, data: patient });
});

exports.updateMine = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { userId: req.user.id } });
  if (!patient) throw new AppError('Patient profile not found', 404);
  await patient.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Patient profile updated', data: patient });
});

exports.getAssignedToMe = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ where: { createdBy: req.user.id } });
  if (!doctor) throw new AppError('Doctor profile not found', 404);

  const mappings = await Mapping.findAll({
    where: { doctorId: doctor.id },
    include: [{ model: Patient, as: 'patient' }],
    order: [['createdAt', 'DESC']],
  });
  res.json({
    success: true,
    count: mappings.length,
    data: mappings.map((mapping) => ({ mappingId: mapping.id, ...mapping.patient.toJSON() })),
  });
});

const findOwned = async (id, user) => {
  const where = user.role === 'other' ? { id } : { id, createdBy: user.id };
  const patient = await Patient.findOne({ where });
  if (!patient) throw new AppError('Patient not found', 404);
  return patient;
};

exports.create = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...pick(req.body, FIELDS), createdBy: req.user.id });
  res.status(201).json({ success: true, message: 'Patient created', data: patient });
});

exports.getAll = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({
    where: req.user.role === 'other' ? {} : { createdBy: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: patients.length, data: patients });
});

exports.getOne = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user);
  res.json({ success: true, data: patient });
});

exports.update = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user);
  await patient.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Patient updated', data: patient });
});

exports.remove = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user);
  await patient.destroy();
  res.json({ success: true, message: 'Patient deleted' });
});