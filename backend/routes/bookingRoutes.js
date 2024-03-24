const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const bookingMiddleware = require("../middlewares/bookingMiddleware");

router.post(
  "/create",
  bookingMiddleware.checkBookingOverlap, // Apply middleware to check for overlaps
  bookingController.createBooking
);

module.exports = router;
