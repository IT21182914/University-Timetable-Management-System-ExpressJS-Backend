const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Reference to the course
  dateTime: { type: Date, required: true }, // Date and time of the class session
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the faculty member
  location: { type: String, required: true }, // Location of the class session
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to enrolled students
});

module.exports = mongoose.model("ClassSession", classSessionSchema);
