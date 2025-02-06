const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Event = require('../models/Event'); // Import Event model
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware
const Joi = require('joi');

// Joi schema for event validation
const eventSchema = Joi.object({
  title: Joi.string().required().messages({ 'string.empty': 'Title is required' }),
  clubName: Joi.string().required().messages({ 'string.empty': 'Club name is required' }),
  eventStartDate: Joi.date().iso().required().messages({ 'date.base': 'Invalid event start date' }),
  eventEndDate: Joi.date().iso().required().messages({ 'date.base': 'Invalid event end date' }),
  location: Joi.string().required().messages({ 'string.empty': 'Location is required' }),
  description: Joi.string().required().messages({ 'string.empty': 'Description is required' }),
  registrationLink: Joi.string().uri().optional().messages({ 'string.uri': 'Invalid registration link' }),
  regStartDate: Joi.date().iso().required().messages({ 'date.base': 'Invalid registration start date' }),
  regEndDate: Joi.date().iso().required().messages({ 'date.base': 'Invalid registration end date' }),
  image: Joi.string().uri().optional().messages({ 'string.uri': 'Invalid image URL' }),
  userId: Joi.string().optional(),
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    // Validate the incoming data using Joi
    const { error } = eventSchema.validate(req.body);
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const userId = req.user._id;

    const {
      title,
      clubName,
      eventStartDate,
      eventEndDate,
      location,
      description,
      registrationLink,
      regStartDate,
      regEndDate,
      image,
    } = req.body;

    const event = new Event({
      title,
      clubName,
      eventStartDate,
      eventEndDate,
      location,
      description,
      registrationLink,
      regStartDate,
      regEndDate,
      image,
      createdAt: Date.now(),
      createdBy: userId, // User ID from protect middleware
    });

    const savedEvent = await event.save();
    console.log('Event data received:', req.body);
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/events
// @desc    Get all events with pagination
// @access  Public
router.get('/', protect, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Validate page and limit
  const currentPage = Math.max(1, parseInt(page));  // Default to 1 if page < 1
  const pageLimit = Math.max(1, parseInt(limit));  // Default to 10 if limit < 1

  try {
    const events = await Event.find()
      .populate('createdBy', 'name email') // Populating creator details
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    const totalEvents = await Event.countDocuments();

    return res.status(200).json({
      success: true,
      data: events,
      totalEvents,
      currentPage: currentPage,
      totalPages: Math.ceil(totalEvents / pageLimit),
    });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch events created by the user
    const events = await Event.find({ createdBy: userId });
    
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found for this user' });
    }

    // Return events in the response
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch events by club name (assuming `clubName` is the club's ObjectId)
router.get('/events/:clubName', protect, async (req, res) => {
  const { clubName } = req.params;

  try {
    // Find events by clubName (which should be the ObjectId of the user/club)
    const events = await Event.find({  clubName });

    if (!events.length) {
      return res.status(404).json({ message: 'No events found' });
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching events', error });
  }
});

module.exports = router;
