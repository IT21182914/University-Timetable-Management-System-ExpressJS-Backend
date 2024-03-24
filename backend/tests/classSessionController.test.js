const classSessionController = require("../controllers/classSessionController");
const ClassSession = require("../models/classSessionModel");
const Notification = require("../models/notificationModel");

describe("Class Session Controller", () => {
  describe("createClassSession", () => {
    it("should create a class session and notify users", async () => {
      const req = {
        body: { courseName: "Test Course", students: ["student1", "student2"] },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const createdClassSession = {
        _id: "sessionId",
        courseName: "Test Course",
        students: ["student1", "student2"],
      };
      ClassSession.create = jest.fn().mockResolvedValue(createdClassSession);

      const notificationMessage = `New class session created for course ${createdClassSession.courseName}`;
      const createdNotification = {
        message: notificationMessage,
        user: createdClassSession.students,
      };
      Notification.create = jest.fn().mockResolvedValue(createdNotification);

      await classSessionController.createClassSession(req, res);

      expect(ClassSession.create).toHaveBeenCalledWith(req.body);
      expect(Notification.create).toHaveBeenCalledWith({
        message: notificationMessage,
        user: req.body.students,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class session created successfully",
        classSession: createdClassSession,
      });
    });

    it("should handle errors", async () => {
      const req = {
        body: { courseName: "Test Course", students: ["student1", "student2"] },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Internal server error";

      ClassSession.create = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await classSessionController.createClassSession(req, res);

      expect(ClassSession.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getStudentTimetable", () => {
    it("should fetch class sessions for a student", async () => {
      const req = { params: { studentId: "student1" } };
      const res = { json: jest.fn() };

      const timetable = [
        {
          _id: "sessionId1",
          courseName: "Test Course 1",
          students: ["student1"],
        },
        {
          _id: "sessionId2",
          courseName: "Test Course 2",
          students: ["student1"],
        },
      ];
      ClassSession.find = jest.fn().mockResolvedValue(timetable);

      await classSessionController.getStudentTimetable(req, res);

      expect(ClassSession.find).toHaveBeenCalledWith({
        students: req.params.studentId,
      });
      expect(res.json).toHaveBeenCalledWith(timetable);
    });

    it("should handle errors", async () => {
      const req = { params: { studentId: "student1" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Internal server error";

      ClassSession.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await classSessionController.getStudentTimetable(req, res);

      expect(ClassSession.find).toHaveBeenCalledWith({
        students: req.params.studentId,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("updateClassSession", () => {
    it("should update an existing class session", async () => {
      const req = {
        params: { id: "sessionId" },
        body: { courseName: "Updated Course" },
      };
      const res = { json: jest.fn() };

      const updatedClassSession = {
        _id: "sessionId",
        courseName: "Updated Course",
        students: ["student1", "student2"],
      };
      ClassSession.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedClassSession);

      await classSessionController.updateClassSession(req, res);

      expect(ClassSession.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Class session updated successfully",
        classSession: updatedClassSession,
      });
    });

    it("should handle errors", async () => {
      const req = {
        params: { id: "sessionId" },
        body: { courseName: "Updated Course" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Internal server error";

      ClassSession.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await classSessionController.updateClassSession(req, res);

      expect(ClassSession.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("deleteClassSession", () => {
    it("should delete an existing class session", async () => {
      const req = { params: { id: "sessionId" } };
      const res = { json: jest.fn() };

      ClassSession.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue({ _id: req.params.id });

      await classSessionController.deleteClassSession(req, res);

      expect(ClassSession.findByIdAndDelete).toHaveBeenCalledWith(
        req.params.id
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Class session deleted successfully",
      });
    });

    it("should handle errors", async () => {
      const req = { params: { id: "sessionId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const errorMessage = "Internal server error";

      ClassSession.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await classSessionController.deleteClassSession(req, res);

      expect(ClassSession.findByIdAndDelete).toHaveBeenCalledWith(
        req.params.id
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
