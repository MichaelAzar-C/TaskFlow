const Project = require("../models/Project");
const Task = require("../models/Task");
const handleError = require("../utils/handleError");

// Helper: is the logged-in user the owner of this project?
const isOwner = (project, user) => project.owner.toString() === user._id.toString();

// CREATE a project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      owner: req.user._id, // from the verified token, never from the body
    });
    res.status(201).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

// READ all projects owned by the logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    handleError(res, error);
  }
};

// READ one project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!isOwner(project, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

// UPDATE a project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!isOwner(project, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.body.name !== undefined) project.name = req.body.name;
    if (req.body.description !== undefined) project.description = req.body.description;

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE a project, together with every task inside it
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!isOwner(project, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Tasks first, so a failure part-way never leaves orphaned tasks behind
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    handleError(res, error);
  }
};
