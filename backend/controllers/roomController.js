const Room = require("../models/roomModel");

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, description, capacity } = req.body;
    const newRoom = new Room({ name, description, capacity });
    await newRoom.save();
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
