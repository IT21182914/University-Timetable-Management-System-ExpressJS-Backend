const ClassSession = require("../models/classSessionModel");

exports.getStudentTimetable = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Fetch class sessions for the given student from the database
    const timetable = await ClassSession.find({ student: studentId }).populate(
      "course"
    );

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
