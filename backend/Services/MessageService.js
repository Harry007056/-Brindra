const Message = require("../models/Message");
const mongoose = require("mongoose");

const { isValidObjectId } = mongoose;

class MessageService {
  async createMessage(payload = {}) {
    const body = String(payload.body || payload.text || payload.message || payload.content || "").trim();
    const projectId = payload.projectId || null;
    const senderId = payload.senderId || null;
    const receiverId = payload.receiverId || null;

    if (!body) {
      throw new Error("body is required");
    }

    if (projectId && !isValidObjectId(projectId)) {
      throw new Error("Invalid projectId");
    }
    if (senderId && !isValidObjectId(senderId)) {
      throw new Error("Invalid senderId");
    }
    if (receiverId && !isValidObjectId(receiverId)) {
      throw new Error("Invalid receiverId");
    }

    if (!projectId && !(senderId && receiverId)) {
      throw new Error("For direct chat, senderId and receiverId are required. For project chat, projectId is required.");
    }

    return Message.create({
      projectId,
      senderId,
      receiverId,
      body
    });
  }

  async listMessages(query = {}) {
    const filter = {};

    const projectId = query.projectId || null;
    const userId = query.userId || null;
    const peerId = query.peerId || null;
    const senderId = query.senderId || null;
    const receiverId = query.receiverId || null;

    if (projectId) {
      if (!isValidObjectId(projectId)) return [];
      filter.projectId = projectId;
    }

    if (userId && !isValidObjectId(userId)) return [];
    if (peerId && !isValidObjectId(peerId)) return [];
    if (senderId && !isValidObjectId(senderId)) return [];
    if (receiverId && !isValidObjectId(receiverId)) return [];

    if (userId && peerId) {
      filter.$or = [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ];
    } else if (userId) {
      filter.$or = [{ senderId: userId }, { receiverId: userId }];
    } else {
      if (senderId) {
        filter.senderId = senderId;
      }
      if (receiverId) {
        filter.receiverId = receiverId;
      }
    }

    if (projectId && userId) {
      filter.$and = [
        { projectId },
        {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      ];
      delete filter.projectId;
      delete filter.$or;
    }

    return Message.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  }
}

module.exports = new MessageService();
