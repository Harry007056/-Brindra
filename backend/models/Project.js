const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "archived"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
