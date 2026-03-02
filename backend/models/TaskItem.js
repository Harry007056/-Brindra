const mongoose = require("mongoose");

const taskItemSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.models.TaskItem || mongoose.model("TaskItem", taskItemSchema);
