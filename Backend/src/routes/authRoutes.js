const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAccessToken,
  createRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  sanitizeUser,
  buildWorkspaceMemberships,
} = require('../utils/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, workspaceName, role, phone } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone || '').trim(),
      passwordHash,
      workspaceName: String(workspaceName || '').trim() || 'Team Workspace',
      role: ['team_leader', 'manager', 'member', 'admin'].includes(role) ? role : 'team_leader',
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    res.status(201).json({
      token: accessToken,
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
      workspaces: buildWorkspaceMemberships(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(String(password || ''), user.passwordHash);
    if (!passwordMatches) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    res.json({
      token: accessToken,
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
      workspaces: buildWorkspaceMemberships(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date()) {
      const error = new Error('Refresh token is invalid or expired');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = createAccessToken(user);
    const nextRefreshToken = createRefreshToken(user);

    await revokeRefreshToken(refreshToken);
    await storeRefreshToken(user, nextRefreshToken);

    res.json({
      token: accessToken,
      accessToken,
      refreshToken: nextRefreshToken,
    });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await revokeRefreshToken(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: sanitizeUser(req.user),
    workspaces: buildWorkspaceMemberships(req.user),
  });
});

router.get('/settings', requireAuth, async (req, res) => {
  res.json({
    profile: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      workspaceName: req.user.workspaceName,
    },
    settings: req.user.settings || {},
  });
});

router.put('/settings', requireAuth, async (req, res, next) => {
  try {
    const { name, email, phone, workspaceName, settings } = req.body;

    if (typeof name === 'string') req.user.name = name.trim() || req.user.name;
    if (typeof workspaceName === 'string') req.user.workspaceName = workspaceName.trim() || req.user.workspaceName;
    if (typeof phone === 'string') req.user.phone = phone.trim();

    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.toLowerCase().trim();
      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
      if (duplicate) {
        const error = new Error('Email is already in use');
        error.statusCode = 409;
        throw error;
      }
      req.user.email = normalizedEmail;
    }

    if (settings && typeof settings === 'object') {
      req.user.settings = {
        ...req.user.settings,
        ...settings,
        notifications: {
          ...(req.user.settings?.notifications || {}),
          ...(settings.notifications || {}),
        },
        security: {
          ...(req.user.settings?.security || {}),
          ...(settings.security || {}),
        },
        appearance: {
          ...(req.user.settings?.appearance || {}),
          ...(settings.appearance || {}),
        },
        language: {
          ...(req.user.settings?.language || {}),
          ...(settings.language || {}),
        },
      };
    }

    await req.user.save();

    res.json({
      message: 'Settings updated',
      user: sanitizeUser(req.user),
      settings: req.user.settings,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const passwordMatches = await bcrypt.compare(String(currentPassword || ''), req.user.passwordHash);
    if (!passwordMatches) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    req.user.passwordHash = await bcrypt.hash(String(newPassword || ''), 10);
    await req.user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
