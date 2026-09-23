const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, validateObjectId, getProjectById);
router.put("/:id", protect, validateObjectId, updateProject);
router.delete("/:id", protect, validateObjectId, deleteProject);

module.exports = router;