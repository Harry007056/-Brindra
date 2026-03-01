import { nanoid } from 'nanoid';
import { Invite } from '../models/Invite.js';
import { Membership } from '../models/Membership.js';
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';

function buildWorkspaceSlug(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'workspace'}-${nanoid(6).toLowerCase()}`;
}

export async function listWorkspaces(req, res) {
  const memberships = await Membership.find({ userId: req.auth.userId, status: 'active' })
    .populate('workspaceId', 'name slug ownerId')
    .lean();

  return res.json({
    workspaces: memberships.map((membership) => ({
      workspaceId: membership.workspaceId?._id,
      name: membership.workspaceId?.name,
      slug: membership.workspaceId?.slug,
      role: membership.role,
      ownerId: membership.workspaceId?.ownerId,
    })),
  });
}

export async function createWorkspace(req, res) {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Workspace name is required' });
  }

  const workspace = await Workspace.create({
    name: name.trim(),
    slug: buildWorkspaceSlug(name.trim()),
    ownerId: req.auth.userId,
  });

  await Membership.create({
    userId: req.auth.userId,
    workspaceId: workspace._id,
    role: 'admin',
    status: 'active',
  });

  return res.status(201).json({
    workspace: {
      id: workspace._id,
      name: workspace.name,
      slug: workspace.slug,
    },
    role: 'admin',
  });
}

export async function createInvite(req, res) {
  const { workspaceId } = req.params;
  const { email, role = 'member' } = req.body;
  if (!email?.trim()) {
    return res.status(400).json({ message: 'Invite email is required' });
  }
  if (!['admin', 'manager', 'member'].includes(role)) {
    return res.status(400).json({ message: 'Invalid invite role' });
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await Invite.create({
    workspaceId,
    email: email.toLowerCase().trim(),
    role,
    token,
    invitedBy: req.auth.userId,
    expiresAt,
  });

  return res.status(201).json({
    invite: {
      id: invite._id,
      workspaceId: invite.workspaceId,
      email: invite.email,
      role: invite.role,
      token: invite.token,
      expiresAt: invite.expiresAt,
      inviteLink: `${req.protocol}://${req.get('host')}/api/workspaces/invites/${invite.token}/accept`,
    },
  });
}

export async function acceptInvite(req, res) {
  const { token } = req.params;
  const invite = await Invite.findOne({ token });
  if (!invite) {
    return res.status(404).json({ message: 'Invite not found' });
  }
  if (invite.acceptedAt) {
    return res.status(409).json({ message: 'Invite already used' });
  }
  if (invite.expiresAt < new Date()) {
    return res.status(410).json({ message: 'Invite expired' });
  }

  const user = await User.findById(req.auth.userId).lean();
  if (!user || user.email.toLowerCase() !== invite.email) {
    return res.status(403).json({ message: 'Invite email does not match your account' });
  }

  await Membership.updateOne(
    { userId: req.auth.userId, workspaceId: invite.workspaceId },
    {
      $set: {
        userId: req.auth.userId,
        workspaceId: invite.workspaceId,
        role: invite.role,
        status: 'active',
      },
    },
    { upsert: true }
  );

  invite.acceptedAt = new Date();
  await invite.save();

  return res.json({ success: true, workspaceId: invite.workspaceId, role: invite.role });
}

export async function listMembers(req, res) {
  const { workspaceId } = req.params;
  const members = await Membership.find({
    workspaceId,
    status: 'active',
  })
    .populate('userId', 'name email avatarUrl')
    .lean();

  return res.json({
    members: members.map((member) => ({
      userId: member.userId?._id,
      name: member.userId?.name,
      email: member.userId?.email,
      avatarUrl: member.userId?.avatarUrl,
      role: member.role,
    })),
  });
}
