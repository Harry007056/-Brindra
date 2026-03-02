const Message = require("../models/Message");

class MessageService {
  async createMessage(payload = {}) {
    const body = String(payload.body || "").trim();
    const projectId = payload.projectId || null;

    if (!projectId || !body) {
      throw new Error("projectId and body are required");
    }

    return Message.create({
      projectId,
      senderId: payload.senderId || null,
      body
    });
  }

  async listMessages(query = {}) {
    const filter = {};
    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    return Message.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  }
}

module.exports = new MessageService();
