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

const defaultSettings = {
  notifications: { email: true, push: false },
  security: { twoFactorEnabled: false },
  appearance: { theme: "system", accentColor: "#5E81AC" },
  language: {
    displayLanguage: "English (US)",
    timeZone: "Asia/Kolkata",
    dateFormat: "MM/DD/YYYY"
  }
};

const resolveSettings = (user) => {
  const raw = user?.settings || {};
  return {
    notifications: {
      email: typeof raw?.notifications?.email === "boolean" ? raw.notifications.email : defaultSettings.notifications.email,
      push: typeof raw?.notifications?.push === "boolean" ? raw.notifications.push : defaultSettings.notifications.push
    },
    security: {
      twoFactorEnabled:
        typeof raw?.security?.twoFactorEnabled === "boolean"
          ? raw.security.twoFactorEnabled
          : defaultSettings.security.twoFactorEnabled
    },
    appearance: {
      theme: ["light", "dark", "system"].includes(raw?.appearance?.theme)
        ? raw.appearance.theme
        : defaultSettings.appearance.theme,
      accentColor: String(raw?.appearance?.accentColor || defaultSettings.appearance.accentColor)
    },
    language: {
      displayLanguage: String(raw?.language?.displayLanguage || defaultSettings.language.displayLanguage),
      timeZone: String(raw?.language?.timeZone || defaultSettings.language.timeZone),
      dateFormat: String(raw?.language?.dateFormat || defaultSettings.language.dateFormat)
    }
  };
};

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
      role: user.role,
      workspaceName: user.workspaceName || "Team Workspace"
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

router.get("/settings", authRequired, async (req, res) => {
  const user = req.user;
  return res.json({
    profile: {
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceName: user.workspaceName || "Team Workspace"
    },
    settings: resolveSettings(user)
  });
});

router.put("/settings", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const body = req.body || {};

    if (Object.prototype.hasOwnProperty.call(body, "name")) {
      const nextName = String(body.name || "").trim();
      if (!nextName) return res.status(400).json({ message: "name is required" });
    }

    if (Object.prototype.hasOwnProperty.call(body, "email")) {
      const nextEmail = String(body.email || "").trim().toLowerCase();
      if (!nextEmail) return res.status(400).json({ message: "email is required" });
      if (nextEmail !== user.email) {
        const exists = await User.findOne({ email: nextEmail, _id: { $ne: user._id } }).select("_id");
        if (exists) return res.status(400).json({ message: "Email already in use" });
      }
    }

    const currentSettings = resolveSettings(user);
    const payloadSettings = body.settings || {};
    const nextSettings = {
      notifications: {
        email:
          typeof payloadSettings?.notifications?.email === "boolean"
            ? payloadSettings.notifications.email
            : currentSettings.notifications.email,
        push:
          typeof payloadSettings?.notifications?.push === "boolean"
            ? payloadSettings.notifications.push
            : currentSettings.notifications.push
      },
      security: {
        twoFactorEnabled:
          typeof payloadSettings?.security?.twoFactorEnabled === "boolean"
            ? payloadSettings.security.twoFactorEnabled
            : currentSettings.security.twoFactorEnabled
      },
      appearance: {
        theme: ["light", "dark", "system"].includes(payloadSettings?.appearance?.theme)
          ? payloadSettings.appearance.theme
          : currentSettings.appearance.theme,
        accentColor: String(payloadSettings?.appearance?.accentColor || currentSettings.appearance.accentColor)
      },
      language: {
        displayLanguage: String(payloadSettings?.language?.displayLanguage || currentSettings.language.displayLanguage),
        timeZone: String(payloadSettings?.language?.timeZone || currentSettings.language.timeZone),
        dateFormat: String(payloadSettings?.language?.dateFormat || currentSettings.language.dateFormat)
      }
    };

    const updates = { settings: nextSettings };
    if (Object.prototype.hasOwnProperty.call(body, "name")) {
      updates.name = String(body.name || "").trim();
    }
    if (Object.prototype.hasOwnProperty.call(body, "email")) {
      updates.email = String(body.email || "").trim().toLowerCase();
    }
    if (Object.prototype.hasOwnProperty.call(body, "workspaceName")) {
      updates.workspaceName = String(body.workspaceName || "").trim() || "Team Workspace";
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        workspaceName: updatedUser.workspaceName || "Team Workspace"
      },
      settings: resolveSettings(updatedUser)
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to save settings" });
  }
});

router.put("/change-password", authRequired, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const nextPassword = String(req.body?.newPassword || "");

    if (!currentPassword || !nextPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }

    if (nextPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(nextPassword, 10);
    await User.updateOne({ _id: req.user._id }, { $set: { password: hashed } });
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to update password" });
  }
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
