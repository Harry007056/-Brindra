const TaskItem = require("../models/TaskItem");
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

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

  async updateTask(taskId, payload = {}) {
    if (!taskId || !isValidObjectId(taskId)) {
      throw new Error("Valid task id is required");
    }

    const update = {};
    if (payload.title !== undefined) {
      const title = String(payload.title || "").trim();
      if (!title) throw new Error("title cannot be empty");
      update.title = title;
    }
    if (payload.description !== undefined) {
      update.description = String(payload.description || "");
    }
    if (payload.assigneeId !== undefined) {
      if (payload.assigneeId === null || payload.assigneeId === "") {
        update.assigneeId = null;
      } else if (!isValidObjectId(payload.assigneeId)) {
        throw new Error("Invalid assigneeId");
      } else {
        update.assigneeId = payload.assigneeId;
      }
    }
    if (payload.completed !== undefined) {
      update.completed = Boolean(payload.completed);
    }
    if (payload.dueDate !== undefined) {
      update.dueDate = payload.dueDate || null;
    }

    const task = await TaskItem.findByIdAndUpdate(taskId, update, { new: true, runValidators: true }).lean();
    if (!task) throw new Error("Task not found");
    return task;
  }
}

module.exports = new TaskService();
