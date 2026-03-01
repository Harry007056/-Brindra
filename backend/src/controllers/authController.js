import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { User } from '../models/User.js';
import { Membership } from '../models/Membership.js';
import { Workspace } from '../models/Workspace.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { env } from '../config/env.js';
import { hashToken } from '../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

function buildWorkspaceSlug(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'workspace'}-${nanoid(6).toLowerCase()}`;
}

async function getPrimaryMembership(userId, preferredWorkspaceId) {
  if (preferredWorkspaceId) {
    const selected = await Membership.findOne({
      userId,
      workspaceId: preferredWorkspaceId,
      status: 'active',
    }).lean();
    if (selected) return selected;
  }

  return Membership.findOne({ userId, status: 'active' }).sort({ createdAt: 1 }).lean();
}

async function issueSession({ userId, workspaceId = null, res }) {
  const accessToken = signAccessToken({ sub: String(userId), workspaceId: workspaceId ? String(workspaceId) : null });
  const refreshToken = signRefreshToken({ sub: String(userId) });
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + env.refreshExpiresDays * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId,
    tokenHash: refreshTokenHash,
    expiresAt,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: env.refreshExpiresDays * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
}

export async function register(req, res) {
  const { name, email, password, workspaceName } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  const workspace = await Workspace.create({
    name: workspaceName?.trim() || `${name.split(' ')[0]}'s Workspace`,
    slug: buildWorkspaceSlug(workspaceName?.trim() || `${name.split(' ')[0]} Workspace`),
    ownerId: user._id,
  });

  await Membership.create({
    userId: user._id,
    workspaceId: workspace._id,
    role: 'admin',
    status: 'active',
  });

  const session = await issueSession({ userId: user._id, workspaceId: workspace._id, res });

  return res.status(201).json({
    token: session.accessToken,
    refreshToken: session.refreshToken,
    user: { id: user._id, name: user.name, email: user.email },
    workspace: { id: workspace._id, name: workspace.name, slug: workspace.slug },
    role: 'admin',
  });
}

export async function login(req, res) {
  const { email, password, workspaceId } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const membership = await getPrimaryMembership(user._id, workspaceId);
  if (!membership) {
    return res.status(403).json({ message: 'No active workspace membership found' });
  }

  const session = await issueSession({ userId: user._id, workspaceId: membership.workspaceId, res });
  const workspace = await Workspace.findById(membership.workspaceId).lean();

  return res.json({
    token: session.accessToken,
    refreshToken: session.refreshToken,
    user: { id: user._id, name: user.name, email: user.email },
    workspace: workspace ? { id: workspace._id, name: workspace.name, slug: workspace.slug } : null,
    role: membership.role,
  });
}

export async function refresh(req, res) {
  const incomingToken = req.body.refreshToken || req.cookies.refreshToken;
  if (!incomingToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  let payload;
  try {
    payload = verifyRefreshToken(incomingToken);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const tokenHash = hashToken(incomingToken);
  const stored = await RefreshToken.findOne({ tokenHash, revokedAt: null });
  if (!stored || stored.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Refresh token expired or revoked' });
  }

  stored.revokedAt = new Date();
  await stored.save();

  const membership = await getPrimaryMembership(payload.sub);
  const session = await issueSession({
    userId: payload.sub,
    workspaceId: membership ? membership.workspaceId : null,
    res,
  });

  return res.json({ token: session.accessToken, refreshToken: session.refreshToken });
}

export async function logout(req, res) {
  const incomingToken = req.body.refreshToken || req.cookies.refreshToken;
  if (incomingToken) {
    const tokenHash = hashToken(incomingToken);
    await RefreshToken.updateOne({ tokenHash }, { $set: { revokedAt: new Date() } });
  }

  res.clearCookie('refreshToken');
  return res.json({ success: true });
}

export async function me(req, res) {
  const user = await User.findById(req.auth.userId).select('_id name email avatarUrl').lean();
  const memberships = await Membership.find({
    userId: req.auth.userId,
    status: 'active',
  })
    .populate('workspaceId', 'name slug')
    .lean();

  const workspaces = memberships.map((membership) => ({
    workspaceId: membership.workspaceId?._id,
    name: membership.workspaceId?.name,
    slug: membership.workspaceId?.slug,
    role: membership.role,
  }));

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    workspaces,
  });
}
