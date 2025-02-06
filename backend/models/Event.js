const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Event title
    clubName: { type: String, required: true }, // Club name
    eventStartDate: { type: Date, required: true }, // Event start date
    eventEndDate: { type: Date, required: true }, // Event end date
    location: { type: String, required: true }, // Event location
    description: { type: String, required: true }, // Event description
    registrationLink: { type: String, default: '' }, // Optional registration link
    regStartDate: { type: Date, required: true }, // Registration start date
    regEndDate: { type: Date, required: true }, // Registration end date
    image: { type: String, default: '' }, // Event poster as base64 or URL
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Ensure this is referencing the correct model for the user
      required: true, // Ensures that the `createdBy` field is populated
    }, // Reference to User model
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Event', eventSchema, 'events');

