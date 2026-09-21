const mongoose = require('mongoose');

// Links a caregiver account to a patient account, with a permission level.
// A caregiver can be linked to multiple patients; a patient can have multiple caregivers.
const caregiverLinkSchema = new mongoose.Schema(
  {
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent duplicate links between the same caregiver and patient
caregiverLinkSchema.index({ caregiver: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model('CaregiverLink', caregiverLinkSchema);
