const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

exports.isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res
      .status(403)
      .json({ message: "Only faculty members can be assigned to courses" });
  }
  next();
};

exports.isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access required" });
  }
  next();
};

exports.isFacultyOrAdmin = (req, res, next) => {
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Faculty or Admin access required" });
  }
  next();
};
