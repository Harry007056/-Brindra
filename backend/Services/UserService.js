const bcrypt = require("bcryptjs");
const User = require("../models/User");

class UserService {
  async createUser(payload = {}) {
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const role = String(payload.role || "member").trim().toLowerCase();
    const workspaceName = String(payload.workspaceName || "").trim();
    const allowedRoles = new Set(["team_leader", "manager", "member"]);

    if (!name || !email || !password) {
      throw new Error("name, email, and password are required");
    }
    if (!allowedRoles.has(role)) {
      throw new Error("Invalid role selected");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
      name,
      email,
      password: hashedPassword,
      role,
      workspaceName: workspaceName || "Team Workspace"
    });
  }

  async listUsers() {
    return User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
  }
}

module.exports = new UserService();
