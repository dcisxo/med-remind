const CaregiverLink = require('../models/CaregiverLink');

// Resolves which patient a request may act on, and enforces the caller's
// permission. Patients always act on themselves. Caregivers must have an
// accepted link to the patient, with 'edit' permission for write actions.
async function resolvePatientAccess(user, patientId, { requireEdit = false } = {}) {
  if (user.role === 'patient') {
    if (patientId && patientId !== user.userId) {
      const err = new Error('Not authorized for this patient');
      err.status = 403;
      throw err;
    }
    return user.userId;
  }

  if (!patientId) {
    const err = new Error('patientId is required');
    err.status = 400;
    throw err;
  }

  const link = await CaregiverLink.findOne({
    caregiver: user.userId,
    patient: patientId,
    status: 'accepted',
  });

  if (!link || (requireEdit && link.permission !== 'edit')) {
    const err = new Error('Not authorized for this patient');
    err.status = 403;
    throw err;
  }

  return patientId;
}

module.exports = { resolvePatientAccess };
