const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const authMiddleware = require("../middlewares/authMiddleware");

// Endpoint to get timetable for a specific student
router.get(
  "/:studentId",
  authMiddleware.authenticateToken,
  authMiddleware.isStudent,
  timetableController.getStudentTimetable
);

module.exports = router;
