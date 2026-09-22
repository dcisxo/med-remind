const Medication = require('../models/Medication');
const DoseLog = require('../models/DoseLog');
const { resolvePatientAccess } = require('../utils/patientAccess');

// POST /api/doselogs
async function logDose(req, res) {
  try {
    const { medicationId, takenAt, status, notes } = req.body;

    if (!medicationId) {
      return res.status(400).json({ message: 'medicationId is required' });
    }

    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    await resolvePatientAccess(req.user, medication.patient.toString(), { requireEdit: true });

    const doseLog = await DoseLog.create({
      medication: medication._id,
      patient: medication.patient,
      takenAt: takenAt || undefined,
      status: ['taken', 'missed', 'skipped'].includes(status) ? status : 'taken',
      notes,
    });
    await doseLog.populate('medication', 'name dosage');

    res.status(201).json({ doseLog });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not log dose' });
  }
}

// GET /api/doselogs?medicationId=&patientId=&limit=
async function listDoseLogs(req, res) {
  try {
    const { medicationId, patientId, limit } = req.query;

    let resolvedPatientId;
    if (medicationId) {
      const medication = await Medication.findById(medicationId);
      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }
      resolvedPatientId = await resolvePatientAccess(req.user, medication.patient.toString());
    } else {
      resolvedPatientId = await resolvePatientAccess(req.user, patientId);
    }

    const query = { patient: resolvedPatientId };
    if (medicationId) query.medication = medicationId;

    const doseLogs = await DoseLog.find(query)
      .sort({ takenAt: -1 })
      .limit(Math.min(Number(limit) || 20, 100))
      .populate('medication', 'name dosage');

    res.json({ doseLogs });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not fetch dose logs' });
  }
}

module.exports = { logDose, listDoseLogs };
