const Project = require("../models/Project");

class ProjectService {
  async createProject(payload = {}) {
    const name = String(payload.name || "").trim();
    if (!name) {
      throw new Error("project name is required");
    }

    return Project.create({
      name,
      ownerId: payload.ownerId || null,
      description: payload.description || "",
      status: payload.status || "active"
    });
  }

  async listProjects(query = {}) {
    const filter = {};
    if (query.ownerId) {
      filter.ownerId = query.ownerId;
    }

    return Project.find(filter).sort({ createdAt: -1 }).lean();
  }
}

module.exports = new ProjectService();
