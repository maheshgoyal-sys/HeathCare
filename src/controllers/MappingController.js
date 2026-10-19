const { Mapping, Patient, Doctor } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  const patient = await Patient.findOne({ where: { id: patientId, createdBy: req.user.id } });
  if (!patient) throw new AppError('Patient not found', 404);

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const existing = await Mapping.findOne({ where: { patientId, doctorId } });
  if (existing) throw new AppError('Doctor is already assigned to this patient', 409);

  const mapping = await Mapping.create({ patientId, doctorId });
  res.status(201).json({ success: true, message: 'Doctor assigned to patient', data: mapping });
});

exports.getAll = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, as: 'patient', where: { createdBy: req.user.id } },
      { model: Doctor, as: 'doctor' },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: mappings.length, data: mappings });
});

exports.getByPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    where: { id: req.params.patient_id, createdBy: req.user.id },
  });
  if (!patient) throw new AppError('Patient not found', 404);

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [{ model: Doctor, as: 'doctor' }],
  });

  res.json({
    success: true,
    patient: { id: patient.id, name: patient.name },
    count: mappings.length,
    data: mappings.map((m) => ({ mappingId: m.id, ...m.doctor.toJSON() })),
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const mapping = await Mapping.findOne({
    where: { id: req.params.id },
    include: [{ model: Patient, as: 'patient', where: { createdBy: req.user.id } }],
  });
  if (!mapping) throw new AppError('Mapping not found', 404);

  await mapping.destroy();
  res.json({ success: true, message: 'Doctor removed from patient' });
});