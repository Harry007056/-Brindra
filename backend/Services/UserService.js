const bcrypt = require("bcryptjs");
const User = require("../models/User");

const Plan = require("../models/Plans");

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

  async assignPlan(userId, planId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found");

    user.currentPlan = plan._id;
    user.planActivatedAt = new Date();
    if (plan.customMembers) user.customPlanMembers = plan.customMembers;
    
    if (!plan.isDemo && plan.durationDays > 0) {
      const msInDay = 24 * 60 * 60 * 1000;
      user.planExpiryDate = new Date(Date.now() + plan.durationDays * msInDay);
    } else {
      user.planExpiryDate = null; // Demo: no expiry
    }

    await user.save();
    return user;
  }

  async createCustomEnterprisePlan(userId, members, price) {
    if (members < 76) throw new Error("Enterprise requires minimum 76 members");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const customPlan = new Plan({
      name: `Enterprise - ${user.workspaceName || 'Custom Team'} (${members} members)`,
      maxBranches: 0,
      price,
      customMembers: members,
      customPrice: price,
      baseMembers: 76,
      basePricePerMember: 13,
      description: "Custom Enterprise plan with dynamic team sizing",
      isDemo: false,
      durationDays: 365 // Annual
    });

    await customPlan.save();
    await this.assignPlan(userId, customPlan._id);
    return customPlan;
  }
}

module.exports = new UserService();
