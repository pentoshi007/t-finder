const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Technician = require('../models/Technician');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  const { technicianId, date } = req.body;

  try {
    const appointment = new Appointment({
      user: req.user.id,
      technician: technicianId,
      date,
    });

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let appointments;

    if (user.role === 'technician') {
      const technician = await Technician.findOne({ user: req.user.id });
      appointments = await Appointment.find({ technician: technician._id }).populate('user', ['name', 'email']);
    } else {
      appointments = await Appointment.find({ user: req.user.id }).populate('technician');
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get appointments for the logged-in user or technician
// @route   GET /api/appointments/my-appointments
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let appointments;
    if (user.role === 'technician') {
      const technician = await Technician.findOne({ user: req.user.id });
      appointments = await Appointment.find({ technician: technician._id }).populate('user', ['name', 'email']);
    } else {
      appointments = await Appointment.find({ user: req.user.id }).populate('technician');
    }
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  const { status, reason } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const user = await User.findById(req.user.id);
    let allowed = false;

    // Technician actions
    if (user.role === 'technician') {
      const technician = await Technician.findOne({ user: req.user.id });
      if (appointment.technician.toString() !== technician._id.toString()) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // Accept only if pending
      if (status === 'Confirmed' && appointment.status === 'Pending') allowed = true;
      // Reject only if pending
      if (status === 'Rejected' && appointment.status === 'Pending') allowed = true;
      // Complete only if confirmed
      if (status === 'Completed' && appointment.status === 'Confirmed') allowed = true;
      // Cancel anytime
      if (status === 'Cancelled') allowed = true;
    }
    // User actions
    else if (user.role === 'user') {
      if (appointment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // User can cancel if not completed/cancelled
      if (status === 'Cancelled' && !['Completed', 'Cancelled'].includes(appointment.status)) allowed = true;
    }

    if (!allowed) {
      return res.status(400).json({ msg: 'Invalid status change or not allowed' });
    }

    appointment.status = status;
    if (reason) appointment.reason = reason;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
