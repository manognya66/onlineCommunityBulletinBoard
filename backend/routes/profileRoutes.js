const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

// Get user profile
router.get('/', protect, getProfile);

// Update user profile
router.put('/', protect, updateProfile);

module.exports = router;
