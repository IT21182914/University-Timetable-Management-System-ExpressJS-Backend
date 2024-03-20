const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// GET all rooms
router.get("/", roomController.getAllRooms);

// POST create a new room
router.post("/", roomController.createRoom);

// PUT update an existing room
router.put("/:id", roomController.updateRoom);

// DELETE delete a room
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
