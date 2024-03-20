// bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const bookingMiddleware = require("../middlewares/bookingMiddleware");

router.post(
  "/create",
  bookingMiddleware.checkBookingOverlap, // Apply middleware to check for overlaps
  bookingController.createBooking
);

// Other routes for booking management can be added here

module.exports = router;
