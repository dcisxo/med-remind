const Medication = require('../models/Medication');
const DoseLog = require('../models/DoseLog');
const { resolvePatientAccess } = require('../utils/patientAccess');

// POST /api/medications
async function createMedication(req, res) {
  try {
    const { patientId, name, dosage, frequency, instructions } = req.body;

    if (!name || !dosage || !frequency) {
      return res.status(400).json({ message: 'Name, dosage, and frequency are required' });
    }

    const resolvedPatientId = await resolvePatientAccess(req.user, patientId, { requireEdit: true });

    const medication = await Medication.create({
      patient: resolvedPatientId,
      name,
      dosage,
      frequency,
      instructions,
    });

    res.status(201).json({ medication });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not create medication' });
  }
}

// GET /api/medications?patientId=
async function listMedications(req, res) {
  try {
    const patientId = await resolvePatientAccess(req.user, req.query.patientId);
    const medications = await Medication.find({ patient: patientId }).sort({ createdAt: -1 });
    res.json({ medications });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not fetch medications' });
  }
}

// PATCH /api/medications/:id
async function updateMedication(req, res) {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    await resolvePatientAccess(req.user, medication.patient.toString(), { requireEdit: true });

    const { name, dosage, frequency, instructions, active } = req.body;
    if (name !== undefined) medication.name = name;
    if (dosage !== undefined) medication.dosage = dosage;
    if (frequency !== undefined) medication.frequency = frequency;
    if (instructions !== undefined) medication.instructions = instructions;
    if (active !== undefined) medication.active = active;

    await medication.save();
    res.json({ medication });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not update medication' });
  }
}

// DELETE /api/medications/:id
async function deleteMedication(req, res) {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    await resolvePatientAccess(req.user, medication.patient.toString(), { requireEdit: true });

    await Medication.deleteOne({ _id: medication._id });
    await DoseLog.deleteMany({ medication: medication._id });

    res.json({ message: 'Medication deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Could not delete medication' });
  }
}

module.exports = { createMedication, listMedications, updateMedication, deleteMedication };
