// courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/",
  authMiddleware.authenticateToken,
  courseController.getAllCourses
);
router.post(
  "/",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  courseController.createCourse
);
router.put(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  courseController.updateCourse
);
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  courseController.deleteCourse
);

// New route for assigning faculty to courses
router.put(
  "/:id/assign-faculty",
  authMiddleware.authenticateToken,
  authMiddleware.isAdmin,
  courseController.assignFacultyToCourse
);

module.exports = router;
