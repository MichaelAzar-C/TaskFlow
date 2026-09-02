require("dotenv").config();
const express = require("express");
const connectDB = require("./src/db");

const app = express();

// Middleware to read JSON from requests
app.use(express.json());

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