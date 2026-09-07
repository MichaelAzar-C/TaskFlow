const Task = require("../models/Task");
const Project = require("../models/Project");

// Helper: does this user own the project the task belongs to?
const ownsProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;
  return project.owner?.toString() === userId.toString();
};

// CREATE a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, project, assignee } = req.body;

    if (!(await ownsProject(project, req.user._id))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const task = await Task.create({ title, description, status, project, assignee });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ all tasks in the user's projects
exports.getTasks = async (req, res) => {
  try {
    const myProjects = await Project.find({ owner: req.user._id }).select("_id");
    const ids = myProjects.map((p) => p._id);

    const tasks = await Task.find({ project: { $in: ids } })
      .populate("project", "name")
      .populate("assignee", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ one task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignee", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!(await ownsProject(task.project?._id, req.user._id))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!(await ownsProject(task.project, req.user._id))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.assignee !== undefined) task.assignee = req.body.assignee;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!(await ownsProject(task.project, req.user._id))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};