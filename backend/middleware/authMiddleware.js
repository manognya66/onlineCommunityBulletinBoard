const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let authToken;

  // Check for authorization header and the Bearer token format
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      authToken = req.headers.authorization.split(' ')[1];
      console.log('Received Token:', authToken); // Log the received token

      if (!authToken) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
      }

      // Verify the token
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Log the decoded payload

      // Ensure the decoded token has the userId field
      if (!decoded.userId) {
        return res.status(400).json({ message: 'Invalid token structure, userId missing' });
      }

      // Get the user based on the ID in the token payload
      req.user = await User.findById(decoded.userId).select('-password');

      // Check if the user exists
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    // No token provided
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
