const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Render booking form
router.get("/", (req, res) => {
  res.render("booking");
});

// Handle booking submission
router.post("/book", async (req, res) => {
  const { name, phone, day, startTime, endTime } = req.body;

  try {
    // Convert start and end times to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for today's date
    if (start < today) {
      return res.status(400).send("Invalid date. You cannot book for past dates.");
    }

    // Validate if the day matches the date
    const actualDay = start.toLocaleDateString("en-US", { weekday: "long" }); // Get actual day from the start date
    if (actualDay.toLowerCase() !== day.toLowerCase()) {
      return res.status(400).send("Day and date do not match!");
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      day,
      $or: [
        { startTime: { $lt: end, $gte: start } }, // Overlaps start
        { endTime: { $gt: start, $lte: end } },  // Overlaps end
        { startTime: { $lte: start }, endTime: { $gte: end } }, // Completely overlaps
      ],
    });

    if (conflictingBooking) {
      return res.status(400).send("Time slot not available.");
    }

    // Save the booking if no conflicts
    const booking = new Booking({
      name,
      phone,
      day,
      startTime: start,
      endTime: end,
    });
    await booking.save();

    res.send("Booking successful!");
  } catch (err) {
    console.error("Error processing booking:", err);
    res.status(500).send("Error processing your request.");
  }
});

module.exports = router;
