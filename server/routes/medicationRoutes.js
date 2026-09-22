const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  createMedication,
  listMedications,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

const router = express.Router();

router.post('/', requireAuth, createMedication);
router.get('/', requireAuth, listMedications);
router.patch('/:id', requireAuth, updateMedication);
router.delete('/:id', requireAuth, deleteMedication);

module.exports = router;
