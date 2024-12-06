const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Render admin panel
router.get('/admin-panel', async (req, res) => {
    try {
      const bookings = await Booking.find(); // Fetch all bookings
      res.render('admin-panel', { bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
      res.status(500).send('Error fetching bookings.');
    }
  });
  router.get('/test', (req, res) => {
    res.send('Admin route working');
  });

module.exports = router;
