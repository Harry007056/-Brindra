const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

function createAccessToken(user) {
  return jwt.sign({ userId: String(user._id) }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '15m',
  });
}

function createRefreshToken(user) {
  return jwt.sign({ userId: String(user._id) }, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret', {
    expiresIn: '7d',
  });
}

async function storeRefreshToken(user, token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt,
  });
}

async function revokeRefreshToken(token) {
  if (!token) return;
  await RefreshToken.deleteOne({ token });
}

function sanitizeUser(user) {
  return {
    id: String(user._id),
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    workspaceName: user.workspaceName,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildWorkspaceMemberships(user) {
  return [
    {
      workspaceId: String(user._id),
      workspaceName: user.workspaceName || 'Team Workspace',
      role: user.role,
    },
  ];
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  sanitizeUser,
  buildWorkspaceMemberships,
};
