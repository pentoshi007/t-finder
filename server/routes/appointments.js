const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment, getMyAppointments } = require('../controllers/appointments');
const auth = require('../middleware/auth');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', auth, createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments for a user
// @access  Private
router.get('/', auth, getAppointments);

// @route   GET /api/appointments/my-appointments
// @desc    Get appointments for the logged-in user or technician
// @access  Private
router.get('/my-appointments', auth, getMyAppointments);

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', auth, updateAppointment);

module.exports = router;
