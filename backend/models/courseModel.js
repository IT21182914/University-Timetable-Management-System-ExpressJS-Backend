const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  faculty: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
  },
  classSessions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ClassSession" },
  ],
  schedule: { type: String, required: true }, // Define schedule field
});

module.exports = mongoose.model("Course", courseSchema);
