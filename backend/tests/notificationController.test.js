const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

describe("Notification Controller - Positive Cases", () => {
  describe("createNotification - Admin Role", () => {
    it("should create a notification for each user when user has admin role", async () => {
      const req = {
        body: { type: "Test", message: "Test notification" },
        user: { role: "admin" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const User = require("../models/userModel");
      User.find = jest
        .fn()
        .mockResolvedValue([{ _id: "user1" }, { _id: "user2" }]);

      const Notification = require("../models/notificationModel");
      Notification.create = jest.fn().mockResolvedValue({});

      authMiddleware.isFacultyOrAdmin = jest
        .fn()
        .mockImplementation((req, res, next) => {
          req.user.role === "admin"
            ? next()
            : res.status(403).json({ message: "Unauthorized" });
        });

      await notificationController.createNotification(req, res);

      expect(Notification.create).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Notifications created successfully",
      });
      expect(authMiddleware.isAdminOrFaculty).toHaveBeenCalled(); // Add this expectation
    });
  });

  describe("getAllNotifications", () => {
    it("should return all notifications", async () => {
      const req = {};
      const res = { json: jest.fn() };

      const Notification = require("../models/notificationModel");
      Notification.find = jest.fn().mockResolvedValue([
        { type: "Test", message: "Test notification 1" },
        { type: "Test", message: "Test notification 2" },
      ]);

      await notificationController.getAllNotifications(req, res);

      expect(Notification.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([
        { type: "Test", message: "Test notification 1" },
        { type: "Test", message: "Test notification 2" },
      ]);
    });
  });
});

describe("Notification Controller - Negative Cases", () => {
  describe("createNotification - Non-admin Role", () => {
    it("should return Unauthorized error when user does not have admin role", async () => {
      const req = {
        body: { type: "Test", message: "Test notification" },
        user: { role: "user" }, // Non-admin role
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      authMiddleware.isAdminOrFaculty = jest
        .fn()
        .mockImplementation((req, res) => {
          res.status(403).json({ message: "Unauthorized" });
        });

      await notificationController.createNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
      expect(authMiddleware.isAdminOrFaculty).toHaveBeenCalled();
    });
  });

  describe("getAllNotifications - Error Handling", () => {
    it("should handle errors when fetching notifications", async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Add status function

      const Notification = require("../models/notificationModel");
      Notification.find = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await notificationController.getAllNotifications(req, res);

      expect(Notification.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500); // Verify status code handling
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
