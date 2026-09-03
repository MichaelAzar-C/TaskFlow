require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const express = require("express");
const connectDB = require("./src/db");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const app = express();

// Middleware to read JSON from requests
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
// Connect to the database
connectDB();

// A simple test route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});