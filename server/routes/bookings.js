const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getTechnicianBookings,
    getBookingById,
    updateBookingStatus,
    getAvailableSlots
} = require('../controllers/bookings');
const auth = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, createBooking);

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', auth, getUserBookings);

// @route   GET /api/bookings/technician-bookings
// @desc    Get technician's bookings
// @access  Private
router.get('/technician-bookings', auth, getTechnicianBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', auth, updateBookingStatus);

// @route   GET /api/bookings/available-slots/:technicianId
// @desc    Get available time slots for a technician
// @access  Public
router.get('/available-slots/:technicianId', getAvailableSlots);

module.exports = router;