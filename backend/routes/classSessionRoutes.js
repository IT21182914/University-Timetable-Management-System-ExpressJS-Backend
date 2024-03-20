const express = require("express");
const router = express.Router();
const classSessionController = require("../controllers/classSessionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticateToken,
  classSessionController.createClassSession
);
router.put(
  "/:id",
  authMiddleware.authenticateToken,
  classSessionController.updateClassSession
);
router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  classSessionController.deleteClassSession
);
router.get(
  "/timetable/:studentId",
  authMiddleware.authenticateToken,
  classSessionController.getStudentTimetable
);

module.exports = router;
