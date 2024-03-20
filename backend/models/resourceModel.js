const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Resource", resourceSchema);
