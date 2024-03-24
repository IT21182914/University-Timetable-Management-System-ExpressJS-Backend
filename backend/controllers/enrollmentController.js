const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Student = require("../models/userModel");

exports.enrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Fetch course details to get the course name
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const courseName = course.name; // Assuming the field name for course name is "name"

    // Fetch student details to get the student name
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const studentName = student.username;

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      courseName,
      studentName,
    });
    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentTimetable = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollment.find({ student: studentId }).populate(
      "course"
    );

    // Map the enrollments to extract course details
    const timetable = enrollments.map((enrollment) => {
      if (enrollment.course) {
        return {
          courseName: enrollment.course.courseName || "Unknown Course",
          schedule: enrollment.course.schedule || "Unknown Schedule",
        };
      } else {
        return {
          courseName: "Unknown Course",
          schedule: "Unknown Schedule",
        };
      }
    });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "student"
    );

    if (!enrollments) {
      return res
        .status(404)
        .json({ error: "No enrollments found for this course" });
    }

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.manageEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { action, studentId } = req.body;
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (action === "remove") {
      await Enrollment.findByIdAndDelete(enrollment._id);
      res.json({ message: "Student removed from course" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
