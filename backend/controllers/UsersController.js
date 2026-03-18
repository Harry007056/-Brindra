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

exports.assignPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }
    const user = await userService.assignPlan(id, planId);
    return res.json({
      message: "Plan assigned successfully",
      user: {
        id: user._id,
        currentPlan: user.currentPlan,
        planActivatedAt: user.planActivatedAt,
        planExpiryDate: user.planExpiryDate
      }
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to assign plan" });
  }
};

exports.assignEnterprisePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { members, totalPrice } = req.body;
    if (!members || !totalPrice) {
      return res.status(400).json({ message: "members and totalPrice required" });
    }
    const plan = await userService.createCustomEnterprisePlan(id, members, totalPrice);
    return res.json({
      message: "Custom Enterprise plan created and assigned",
      plan
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create enterprise plan" });
  }
};
