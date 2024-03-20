const Notification = require("../models/notificationModel");

exports.generateNotification = async (message, type) => {
  try {
    const notification = await Notification.create({ message, type });
    return notification;
  } catch (error) {
    throw new Error("Failed to generate notification");
  }
};
