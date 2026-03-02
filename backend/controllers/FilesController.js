const fileService = require("../Services/FileService");

exports.create = async (req, res) => {
  try {
    const file = await fileService.addFile(req.body);
    return res.status(201).json(file);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create file" });
  }
};

exports.list = async (req, res) => {
  try {
    const files = await fileService.listFiles(req.query);
    return res.json(files);
  } catch (_err) {
    return res.status(500).json({ message: "Failed to fetch files" });
  }
};
