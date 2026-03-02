const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const ACCESS_SECRET = process.env.JWT_SECRET || "dev-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const ALLOWED_ROLES = new Set(["team_leader", "manager", "member"]);

const signAccessToken = (user) =>
  jwt.sign(
    { id: String(user._id), email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { id: String(user._id), email: user.email, role: user.role, tokenType: "refresh" },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );

const authRequired = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization || "");
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const role = String(req.body?.role || "member").trim().toLowerCase();
    const workspaceName = String(req.body?.workspaceName || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    if (!ALLOWED_ROLES.has(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      workspaceName: workspaceName || "Team Workspace"
    });

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceName: user.workspaceName
      }
    });
  } catch (_err) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const selectedRole = String(req.body?.role || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (selectedRole && user.role !== selectedRole) {
      return res.status(403).json({ message: "Selected role does not match this account" });
    }

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceName: user.workspaceName
      }
    });
  } catch (_err) {
    return res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  const user = req.user;
  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    workspaces: [
      {
        workspaceId: String(user._id),
        name: user.workspaceName || "Team Workspace",
        role: user.role
      }
    ]
  });
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = String(req.body?.refreshToken || "");
    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    if (decoded?.tokenType !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    return res.json({
      token: signAccessToken(user)
    });
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

router.post("/logout", (_req, res) => res.json({ message: "Logged out" }));

module.exports = router;
