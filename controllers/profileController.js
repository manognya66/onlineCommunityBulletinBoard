const User = require('../models/User'); // Assuming you have a User model to handle profile data

// Get profile data for the authenticated user
const getProfile = async (req, res) => {
  try {
    // Extract the user ID from the JWT token
    const userId = req.user.id;  // Assuming the token contains the user ID

    // Fetch the user data from the database
    const user = await User.findById(userId).select('email fullName phoneNumber clubName collegeRegistrationId collegeName');  // Fetch only email and name

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.json({
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber, 
      clubName: user.clubName,
      collegeRegistrationId: user.collegeRegistrationId, 
      collegeName: user.collegeName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile data for the authenticated user
const updateProfile = async (req, res) => {
  try {
    const { phoneNumber, collegeName, collegeRegistrationId, clubName } = req.body;
    const user = await User.findById(req.user.id); // Use the user ID from the token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile data
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.collegeName = collegeName || user.collegeName;
    user.collegeRegistrationId = collegeRegistrationId || user.collegeRegistrationId;
    user.clubName = clubName || user.clubName;

    await user.save(); // Save the updated user data

    return res.json(user); // Return the updated profile data
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };
