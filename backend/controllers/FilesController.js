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

exports.remove = async (req, res) => {
  try {
    const deleted = await fileService.deleteFile(req.params.id);
    return res.json({ message: "File deleted", file: deleted });
  } catch (err) {
    const status = String(err.message || "").includes("not found") ? 404 : 400;
    return res.status(status).json({ message: err.message || "Failed to delete file" });
  }
};
