const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const Course = require("../models/courseModel");

describe("Course Controller - Positive Cases", () => {
  describe("getAllCourses", () => {
    it("should return all courses", async () => {
      const req = {};
      const res = { json: jest.fn() };

      const courses = [
        { name: "Course 1", description: "Description 1" },
        { name: "Course 2", description: "Description 2" },
      ];

      Course.find = jest.fn().mockResolvedValue(courses);

      await courseController.getAllCourses(req, res);

      expect(Course.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(courses);
    });
  });

  describe("createCourse", () => {
    it("should create a new course", async () => {
      const req = { body: { name: "New Course", description: "Description" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const createdCourse = { _id: "courseId", ...req.body };

      Course.create = jest.fn().mockResolvedValue(createdCourse);

      await courseController.createCourse(req, res);

      expect(Course.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Course created successfully",
        course: createdCourse,
      });
    });
  });

  describe("updateCourse", () => {
    it("should update an existing course", async () => {
      const courseId = "courseId";
      const updatedCourseData = {
        name: "Updated Course",
        description: "New Description",
      };

      const req = { params: { id: courseId }, body: updatedCourseData };
      const res = { json: jest.fn() };

      const updatedCourse = { _id: courseId, ...updatedCourseData };

      Course.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCourse);

      await courseController.updateCourse(req, res);

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        courseId,
        updatedCourseData,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    });
  });

  describe("deleteCourse", () => {
    it("should delete an existing course", async () => {
      const courseId = "courseId";
      const req = { params: { id: courseId } };
      const res = { json: jest.fn() };

      Course.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: courseId });

      await courseController.deleteCourse(req, res);

      expect(Course.findByIdAndDelete).toHaveBeenCalledWith(courseId);
      expect(res.json).toHaveBeenCalledWith({
        message: "Course deleted successfully",
      });
    });
  });

  describe("assignFacultyToCourse", () => {
    it("should assign faculty to a course", async () => {
      const courseId = "courseId";
      const facultyId = "facultyId";
      const facultyName = "Faculty Name";

      const req = {
        params: { id: courseId },
        body: { facultyId, facultyName },
      };
      const res = { json: jest.fn() };

      const course = {
        _id: courseId,
        name: "Course Name",
        description: "Course Description",
      };

      Course.findById = jest.fn().mockResolvedValue(course);
      course.save = jest.fn().mockResolvedValue(course);

      await courseController.assignFacultyToCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith(courseId);
      expect(course.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Faculty assigned to course successfully",
        course,
      });
    });
  });
});

describe("Course Controller - Negative Cases", () => {
  describe("getAllCourses - Error Handling", () => {
    it("should handle errors when fetching courses", async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.find = jest.fn().mockRejectedValue(new Error("Database error"));

      await courseController.getAllCourses(req, res);

      expect(Course.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("createCourse - Error Handling", () => {
    it("should handle errors when creating a course", async () => {
      const req = { body: { name: "New Course", description: "Description" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.create = jest.fn().mockRejectedValue(new Error("Database error"));

      await courseController.createCourse(req, res);

      expect(Course.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateCourse - Error Handling", () => {
    it("should handle errors when updating a course", async () => {
      const courseId = "courseId";
      const updatedCourseData = {
        name: "Updated Course",
        description: "New Description",
      };

      const req = { params: { id: courseId }, body: updatedCourseData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await courseController.updateCourse(req, res);

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        courseId,
        updatedCourseData,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});

describe("deleteCourse - Error Handling", () => {
  it("should handle errors when deleting a course", async () => {
    const courseId = "courseId";
    const req = { params: { id: courseId } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Course.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await courseController.deleteCourse(req, res);

    expect(Course.findByIdAndDelete).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
