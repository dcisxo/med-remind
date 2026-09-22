const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { logDose, listDoseLogs } = require('../controllers/doseLogController');

const router = express.Router();

router.post('/', requireAuth, logDose);
router.get('/', requireAuth, listDoseLogs);

module.exports = router;
