const User = require('../models/User');
const CaregiverLink = require('../models/CaregiverLink');

// POST /api/caregiver/invite  (caregiver invites a patient by email)
async function invitePatient(req, res) {
  try {
    const { patientEmail, permission } = req.body;
    const caregiverId = req.user.userId;

    const patient = await User.findOne({ email: patientEmail.toLowerCase(), role: 'patient' });
    if (!patient) {
      return res.status(404).json({ message: 'No patient account found with that email' });
    }

    const link = await CaregiverLink.create({
      caregiver: caregiverId,
      patient: patient._id,
      permission: permission === 'edit' ? 'edit' : 'view',
      status: 'pending',
    });

    res.status(201).json({ link });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A link already exists between these accounts' });
    }
    res.status(500).json({ message: 'Could not create invite', error: err.message });
  }
}

// POST /api/caregiver/links/:linkId/accept  (patient accepts a pending link)
async function acceptLink(req, res) {
  try {
    const link = await CaregiverLink.findOne({
      _id: req.params.linkId,
      patient: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    link.status = 'accepted';
    await link.save();

    res.json({ link });
  } catch (err) {
    res.status(500).json({ message: 'Could not accept link', error: err.message });
  }
}

// GET /api/caregiver/patients  (caregiver views their linked patients)
async function getMyPatients(req, res) {
  try {
    const links = await CaregiverLink.find({
      caregiver: req.user.userId,
      status: 'accepted',
    }).populate('patient', 'name email');

    res.json({ links });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch patients', error: err.message });
  }
}

module.exports = { invitePatient, acceptLink, getMyPatients };
