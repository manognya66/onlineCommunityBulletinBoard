const Event = require('../models/Event');
const multer = require('multer');

// Set up multer to handle file uploads and limit file size
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for file uploads
}).single('file'); // Assuming you're uploading a single file

// Create a new event with file upload
exports.createEvent = async (req, res) => {
  try {
    // First, handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }

      // Now, get other event details
      const {
        title,
        description,
        eventStartDate,
        eventEndDate,
        regStartDate,
        regEndDate,
        clubName,
        location,
        registrationLink,
      } = req.body;

      // Input validation
      if (
        !title || !description || !eventStartDate ||
        !eventEndDate || !regStartDate || !regEndDate ||
        !clubName || !location || !registrationLink
      ) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Access the uploaded file from req.file
      const image = req.file ? req.file.path : null; // Save file path or handle accordingly

      // Create the event
      const event = await Event.create({
        title,
        description,
        eventStartDate,
        eventEndDate,
        regStartDate,
        regEndDate,
        clubName,
        location,
        image, // Save the image file path in the event document
        registrationLink,
        createdBy: req.user._id, // Assuming req.user._id is available from auth middleware
        createdAt: Date.now(),
      });

      // Respond with the created event
      res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        event,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating the event.',
      error: error.message,
    });
  }
};

// Get all events for a user
exports.getEvents = async (req, res) => {
  try {
     console.log(req.body);
     console.log(req.query)
    const events = await Event.find({ createdBy: req.users._id })  // Filtering by user ID
      .sort({ eventStartDate: 1 })  // Sorting by event start date
      .select('title clubName eventStartDate eventEndDate location image registrationLink regStartDate regEndDate description');

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events.',
      error: error.message,
    });
  }
};

