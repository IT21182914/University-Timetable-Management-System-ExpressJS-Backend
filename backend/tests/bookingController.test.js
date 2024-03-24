const bookingController = require("../controllers/bookingController");
const Booking = require("../models/bookingModel");

describe("Booking Controller", () => {
  describe("createBooking", () => {
    it("should create a new booking", async () => {
      const req = {
        body: { roomId: "roomId", startTime: new Date(), endTime: new Date() },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const newBooking = { _id: "bookingId", ...req.body };
      Booking.prototype.save = jest.fn().mockResolvedValue(newBooking);

      await bookingController.createBooking(req, res);

      expect(Booking.prototype.save).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: "Booking created successfully",
        booking: newBooking,
      });
    });

    it("should handle errors when creating a booking", async () => {
      const req = {
        body: { roomId: "roomId", startTime: new Date(), endTime: new Date() },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Booking.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
