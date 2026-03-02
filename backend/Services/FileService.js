const FileResource = require("../models/FileResource");

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
}

module.exports = new FileService();
