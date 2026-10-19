const { Patient } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['name', 'age', 'gender', 'disease'];

const findOwned = async (id, userId) => {
  const patient = await Patient.findOne({ where: { id, createdBy: userId } });
  if (!patient) throw new AppError('Patient not found', 404);
  return patient;
};

exports.create = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...pick(req.body, FIELDS), createdBy: req.user.id });
  res.status(201).json({ success: true, message: 'Patient created', data: patient });
});

exports.getAll = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({
    where: { createdBy: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: patients.length, data: patients });
});

exports.getOne = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  res.json({ success: true, data: patient });
});

exports.update = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.update(pick(req.body, FIELDS));
  res.json({ success: true, message: 'Patient updated', data: patient });
});

exports.remove = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.destroy();
  res.json({ success: true, message: 'Patient deleted' });
});