const express = require('express');
const router = express.Router();
// Import the new register function, and keep the others you need.
const { register, loginUser, getUserProfile, updateUserProfile } = require('../controllers/users');
const auth = require('../middleware/auth');

// @route   POST /api/users/register (This becomes a general registration route)
// @desc    Register a new user or technician
// @access  Public
router.post('/register', register);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateUserProfile);

module.exports = router;