const express = require('express');
const bcrypt = require('bcryptjs');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const User = require('../models/User');
const Joi = require('joi');
const router = express.Router();

// Joi schema for validation
const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  return registerUser(req, res); // Call the fixed registerUser function
});

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  return loginUser(req, res); // Call the fixed loginUser function
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  return forgotPassword(req, res);
});

module.exports = router;
