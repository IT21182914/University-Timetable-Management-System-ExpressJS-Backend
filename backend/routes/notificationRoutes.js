const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/create",
  authMiddleware.authenticateToken,
  authMiddleware.isFacultyOrAdmin,
  notificationController.createNotification
);

router.get(
  "/",
  authMiddleware.authenticateToken,
  notificationController.getAllNotifications
);

module.exports = router;
