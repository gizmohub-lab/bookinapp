const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// MongoDB connection
// MongoDB connection using environment variable
mongoose
  .connect(process.env.MONGO_URI, {
 
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use('/', bookingRoutes);  // Booking Routes should be loaded first
app.use(adminRoutes);         // Admin Routes should be loaded after

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
