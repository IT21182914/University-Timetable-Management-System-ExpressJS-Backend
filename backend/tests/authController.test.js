const authController = require("../controllers/authController");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret } = require("../config/config");

jest.mock("jsonwebtoken");
jest.mock("../models/userModel");
jest.mock("bcryptjs");

describe("Auth Controller", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = { json: jest.fn() };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(req.body);

      bcrypt.hash.mockResolvedValue("hashedPassword");

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });

      expect(User.create).toHaveBeenCalledWith({
        username: req.body.username,
        email: req.body.email,
        password: "hashedPassword",
        role: "student",
      });

      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: req.body,
      });
    });

    it("should handle existing email during registration", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue({});

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        message: "Email is already registered",
      });
    });

    it("should handle errors during registration", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockRejectedValue(new Error("Database error"));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("login", () => {
    it("should login a user with valid credentials", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { json: jest.fn() };

      const user = {
        _id: "userId",
        email: req.body.email,
        password: "hashedPassword",
        role: "student",
      };
      User.findOne.mockResolvedValue(user);

      bcrypt.compare.mockResolvedValue(true);

      jwt.sign.mockReturnValue("jwtToken");

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        user.password
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user._id, role: user.role },
        jwtSecret,
        { expiresIn: "1h" }
      );

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "jwtToken",
      });
    });

    it("should handle non-existent user during login", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle invalid password during login", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const user = {
        _id: "userId",
        email: req.body.email,
        password: "hashedPassword",
        role: "student",
      };
      User.findOne.mockResolvedValue(user);

      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
    });

    it("should handle errors during login", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne.mockRejectedValue(new Error("Database error"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
