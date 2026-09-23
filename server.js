require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/db");

const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const { authLimiter, apiLimiter } = require("./src/middleware/rateLimiter");

const app = express();

// Behind a hosting provider's proxy (Render, Railway...), trust the first hop so the
// rate limiter sees each visitor's real IP instead of the proxy's.
// Only in production: trusting proxy headers locally would let clients spoof their IP.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS: only the front ends listed in CLIENT_URLS may call the API from a browser.
// Tools with no Origin header (Postman, curl) are unaffected.
const allowedOrigins = (
  process.env.CLIENT_URLS || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

// Parse JSON bodies, rejecting anything larger than 10 kB
app.use(express.json({ limit: "10kb" }));

// A simple test route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", apiLimiter, projectRoutes);
app.use("/api/tasks", apiLimiter, taskRoutes);

// Unknown routes: JSON 404 instead of Express's default HTML page
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Errors raised before a controller runs (bad JSON, oversized body, ...)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

// Start the server only after the database is connected
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
