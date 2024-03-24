const roomController = require("../controllers/roomController");
const Room = require("../models/roomModel");

describe("Room Controller", () => {
  describe("getAllRooms", () => {
    it("should return all rooms", async () => {
      const req = {};
      const res = { json: jest.fn() };

      const rooms = [
        { name: "Room 1", description: "Description 1", capacity: 10 },
        { name: "Room 2", description: "Description 2", capacity: 20 },
      ];
      Room.find = jest.fn().mockResolvedValue(rooms);

      await roomController.getAllRooms(req, res);

      expect(res.json).toHaveBeenCalledWith(rooms);
    });

    it("should handle errors when fetching rooms", async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Room.find = jest.fn().mockRejectedValue(new Error("Database error"));

      await roomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("createRoom", () => {
    it("should create a new room", async () => {
      const req = {
        body: {
          name: "New Room",
          description: "New Description",
          capacity: 15,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const newRoom = { _id: "roomId", ...req.body };
      Room.prototype.save = jest.fn().mockResolvedValue(newRoom);

      await roomController.createRoom(req, res);

      expect(Room.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Room created successfully",
        room: newRoom,
      });
    });

    it("should handle errors when creating a room", async () => {
      const req = {
        body: {
          name: "New Room",
          description: "New Description",
          capacity: 15,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Room.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await roomController.createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
