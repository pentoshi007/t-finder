const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
