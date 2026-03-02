const messageService = require("../Services/MessageService");

exports.create = async (req, res) => {
  try {
    const message = await messageService.createMessage(req.body);
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
