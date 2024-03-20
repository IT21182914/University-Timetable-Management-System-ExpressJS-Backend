const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/enroll",
  authMiddleware.authenticateToken,
  enrollmentController.enrollCourse
);
router.get(
  "/timetable/:studentId",
  authMiddleware.authenticateToken,
  enrollmentController.getStudentTimetable
);
router.get(
  "/course/:courseId/enrollments",
  authMiddleware.authenticateToken,
  enrollmentController.viewCourseEnrollments
);
router.put(
  "/course/:courseId/enrollments",
  authMiddleware.authenticateToken,
  enrollmentController.manageEnrollments
);

module.exports = router;
