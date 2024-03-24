const enrollmentController = require("../controllers/enrollmentController");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Student = require("../models/userModel");

describe("Enrollment Controller", () => {
  describe("enrollCourse", () => {
    it("should enroll a student into a course successfully", async () => {
      const req = { body: { studentId: "studentId", courseId: "courseId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.findById = jest.fn().mockResolvedValue({ name: "Test Course" });
      Student.findById = jest
        .fn()
        .mockResolvedValue({ username: "Test Student" });
      Enrollment.create = jest.fn().mockResolvedValue({});

      await enrollmentController.enrollCourse(req, res);

      expect(Enrollment.create).toHaveBeenCalledWith({
        student: req.body.studentId,
        course: req.body.courseId,
        courseName: "Test Course",
        studentName: "Test Student",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Enrollment successful",
        enrollment: {},
      });
    });

    it("should return 404 if course not found", async () => {
      const req = { body: { studentId: "studentId", courseId: "courseId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.findById = jest.fn().mockResolvedValue(null);

      await enrollmentController.enrollCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
    });
  });
});
