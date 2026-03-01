import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { Membership } from '../models/Membership.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing access token' });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user session' });
    }

    req.auth = {
      userId: String(user._id),
      email: user.email,
      selectedWorkspaceId: payload.workspaceId || null,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(allowedRoles) {
  return async function roleGuard(req, res, next) {
    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ message: 'workspaceId is required' });
    }

    const membership = await Membership.findOne({
      userId: req.auth.userId,
      workspaceId,
      status: 'active',
    }).lean();

    if (!membership) {
      return res.status(403).json({ message: 'Not a workspace member' });
    }

    if (!allowedRoles.includes(membership.role)) {
      return res.status(403).json({ message: 'Insufficient role permission' });
    }

    req.auth.membership = membership;
    next();
  };
}
