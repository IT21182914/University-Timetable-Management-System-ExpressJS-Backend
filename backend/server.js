const express = require("express");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const classSessionRoutes = require("./routes/classSessionRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // Import notification routes

const app = express();
app.use(express.json());

mongoose
  .connect(mongoURI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/class-sessions", classSessionRoutes);
app.use("/bookings", bookingRoutes);
app.use("/rooms", roomRoutes);
app.use("/resources", resourceRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/notifications", notificationRoutes); // Mount notification routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
