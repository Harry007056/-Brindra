const projectService = require("../Services/ProjectService");

exports.create = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    return res.status(201).json(project);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create project" });
  }
};

exports.list = async (req, res) => {
  try {
    const projects = await projectService.listProjects(req.query);
    return res.json(projects);
  } catch (_err) {
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};
