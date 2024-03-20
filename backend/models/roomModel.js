const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
