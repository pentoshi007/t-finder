const express = require('express');
const router = express.Router();
const { registerTechnician, getTechnicians, getTechnicianById, addReview } = require('../controllers/technicians');
const auth = require('../middleware/auth');

// @route   POST /api/technicians/register
// @desc    Register a new technician
// @access  Public
router.post('/register', registerTechnician);

// @route   GET /api/technicians
// @desc    Get technicians by query
// @access  Public
router.get('/', getTechnicians);

// @route   GET /api/technicians/:id
// @desc    Get single technician
// @access  Public
router.get('/:id', getTechnicianById);

// @route   POST /api/technicians/:id/reviews
// @desc    Add a review to a technician
// @access  Private
router.post('/:id/reviews', auth, addReview);

module.exports = router;
