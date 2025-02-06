require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const path = require('path');

const app = express(); // Initialize app here
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, '../frontend/build');

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true // Allow cookies, tokens, and authentication headers
}));

// Serve static files from the frontend build directory
app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"),
  function(err){
    if(err){
      res.status(500).send(err);
    }
  }
  );
});

connectDB();

// Increase max event listeners to avoid memory leak warnings
const emitter = require('events');
emitter.setMaxListeners(15);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));