const FileResource = require("../models/FileResource");
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

class FileService {
  async addFile(payload = {}) {
    const fileName = String(payload.fileName || "").trim();
    const path = String(payload.path || "").trim();
    const projectId = payload.projectId || null;

    if (!projectId || !fileName || !path) {
      throw new Error("projectId, fileName, and path are required");
    }

    return FileResource.create({
      projectId,
      uploaderId: payload.uploaderId || null,
      fileName,
      path,
      mimeType: payload.mimeType || "",
      sizeBytes: Number(payload.sizeBytes || 0)
    });
  }

  async listFiles(query = {}) {
    const filter = {};
    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    return FileResource.find(filter).sort({ createdAt: -1 }).lean();
  }

  async deleteFile(fileId) {
    if (!fileId || !isValidObjectId(fileId)) {
      throw new Error("Valid file id is required");
    }

    const deleted = await FileResource.findByIdAndDelete(fileId).lean();
    if (!deleted) {
      throw new Error("File not found");
    }

    return deleted;
  }
}

module.exports = new FileService();
