import { Router } from 'express';
import {
  acceptInvite,
  createInvite,
  createWorkspace,
  listMembers,
  listWorkspaces,
} from '../controllers/workspaceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listWorkspaces);
router.post('/', createWorkspace);
router.get('/:workspaceId/members', requireRole(['admin', 'manager', 'member']), listMembers);
router.post('/:workspaceId/invites', requireRole(['admin', 'manager']), createInvite);
router.post('/invites/:token/accept', acceptInvite);

export default router;
