const Course = require("../models/courseModel");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignFacultyToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyId, facultyName } = req.body; // Extract facultyName from the request body

    // Check if the course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the faculty assigned to the course with ID and Name
    course.faculty = { _id: facultyId, name: facultyName };
    await course.save();

    res.json({ message: "Faculty assigned to course successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
