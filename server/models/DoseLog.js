const mongoose = require('mongoose');

const doseLogSchema = new mongoose.Schema(
  {
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['taken', 'missed', 'skipped'],
      default: 'taken',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

doseLogSchema.index({ patient: 1, takenAt: -1 });

module.exports = mongoose.model('DoseLog', doseLogSchema);
