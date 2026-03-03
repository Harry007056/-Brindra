const messageService = require("../Services/MessageService");
const { getIO } = require("../socket");

exports.create = async (req, res) => {
  try {
    const message = await messageService.createMessage(req.body);

    const io = getIO();
    if (io) {
      if (message.projectId) {
        io.to(`project:${String(message.projectId)}`).emit("project_message:new", message);
      }
      if (message.senderId) {
        io.to(`user:${String(message.senderId)}`).emit("direct_message:new", message);
      }
      if (message.receiverId) {
        io.to(`user:${String(message.receiverId)}`).emit("direct_message:new", message);
      }
    }

    return res.status(201).json(message);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create message" });
  }
};

exports.list = async (req, res) => {
  try {
    const messages = await messageService.listMessages(req.query);
    return res.json(messages);
  } catch (_err) {
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};
