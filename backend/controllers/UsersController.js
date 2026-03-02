const userService = require("../Services/UserService");

exports.create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create user" });
  }
};

exports.list = async (_req, res) => {
  try {
    const users = await userService.listUsers();
    return res.json(users);
  } catch (_err) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};
