const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clubName: { type: String, required: false },
  collegeRegistrationId: { type: String, required: false }, 
  collegeName: { type: String, required: false }, 
  phoneNumber: { type: String, required: false },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
