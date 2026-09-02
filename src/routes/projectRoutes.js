const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", createProject);        // POST   /api/projects
router.get("/", getProjects);           // GET    /api/projects
router.get("/:id", getProjectById);     // GET    /api/projects/:id
router.put("/:id", updateProject);      // PUT    /api/projects/:id
router.delete("/:id", deleteProject);   // DELETE /api/projects/:id

module.exports = router;