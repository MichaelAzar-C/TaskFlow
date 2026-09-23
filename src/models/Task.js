const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [150, "Task title must be 150 characters or fewer"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description must be 1000 characters or fewer"],
  },
  status: {
    type: String,
    enum: {
      values: ["todo", "in-progress", "done"],
      message: "Status must be todo, in-progress or done",
    },
    default: "todo",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project is required"],
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
