const mongoose = require("mongoose");

const fileResourceSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    fileName: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    mimeType: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.FileResource || mongoose.model("FileResource", fileResourceSchema);
