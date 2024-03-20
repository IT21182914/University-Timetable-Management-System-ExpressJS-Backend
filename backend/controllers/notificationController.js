const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

exports.createNotification = async (req, res) => {
  try {
    const { type, message } = req.body;

    // Get all users from the database
    const users = await User.find();

    // Create a notification for each user
    const notifications = await Promise.all(
      users.map(async (user) => {
        const notification = await Notification.create({
          type,
          message,
          userId: user._id,
        });
        return notification;
      })
    );

    res
      .status(201)
      .json({ message: "Notifications created successfully", notifications });
  } catch (error) {
    console.error("Error creating notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
