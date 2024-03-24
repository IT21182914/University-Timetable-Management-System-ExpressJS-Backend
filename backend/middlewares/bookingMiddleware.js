const Booking = require("../models/bookingModel");

// Middleware to check for overlaps in bookings
exports.checkBookingOverlap = async (req, res, next) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    // Check for existing bookings that overlap with the requested time range
    const existingBookings = await Booking.find({
      roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // New booking overlaps with existing booking
        { startTime: { $gte: startTime, $lt: endTime } }, // Existing booking starts within new booking's time range
        { endTime: { $gt: startTime, $lte: endTime } }, // Existing booking ends within new booking's time range
      ],
    });

    // If there are existing overlapping bookings, return an error
    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Booking overlaps with existing bookings" });
    }

    // If no overlaps, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
