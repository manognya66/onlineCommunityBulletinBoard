const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the new user (no need to hash the password manually since pre-save hook handles it)
    const user = await User.create({ fullName, email, password });

    // Generate JWT token
    const token = exports.generateToken(user._id);

    // Send successful response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login an existing user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Try to find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password using the matchPassword method
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = exports.generateToken(user._id);

    // Send successful response
    return res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
};

// Forgot password function (placeholder)
exports.forgotPassword = async (req, res) => {
  try {
    res.json({ message: 'Forgot password route' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
