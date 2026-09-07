require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/db");

const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Start the server only after the database is connected
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();