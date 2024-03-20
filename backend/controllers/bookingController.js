const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const newBooking = new Booking({ roomId, startTime, endTime });
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other controller functions for updating and deleting bookings can be implemented here
