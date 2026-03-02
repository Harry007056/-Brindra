const TaskItem = require("../models/TaskItem");

class TaskService {
  async createTask(payload = {}) {
    const title = String(payload.title || "").trim();
    const projectId = payload.projectId || null;

    if (!projectId || !title) {
      throw new Error("projectId and title are required");
    }

    return TaskItem.create({
      projectId,
      title,
      description: payload.description || "",
      assigneeId: payload.assigneeId || null,
      completed: Boolean(payload.completed),
      dueDate: payload.dueDate || null
    });
  }

  async listTasks(query = {}) {
    const filter = {};
    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    return TaskItem.find(filter).sort({ createdAt: -1 }).lean();
  }
}

module.exports = new TaskService();
