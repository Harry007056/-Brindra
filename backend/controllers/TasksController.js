const taskService = require("../Services/TaskService");

exports.create = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    return res.status(201).json(task);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create task" });
  }
};

exports.list = async (req, res) => {
  try {
    const tasks = await taskService.listTasks(req.query);
    return res.json(tasks);
  } catch (_err) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
