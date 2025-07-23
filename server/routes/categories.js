const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categories');

// @route   GET /api/categories
router.route('/').get(getCategories);

module.exports = router;
