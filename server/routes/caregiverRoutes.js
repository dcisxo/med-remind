const express = require('express');
const { invitePatient, acceptLink, getMyPatients } = require('../controllers/caregiverController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/invite', requireAuth, requireRole('caregiver'), invitePatient);
router.post('/links/:linkId/accept', requireAuth, requireRole('patient'), acceptLink);
router.get('/patients', requireAuth, requireRole('caregiver'), getMyPatients);

module.exports = router;
