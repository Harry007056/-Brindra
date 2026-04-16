const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const FileItem = require('../models/FileItem');
const RefreshToken = require('../models/RefreshToken');

const router = express.Router();

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ''));
}

function normalizeFile(item) {
  return {
    ...item.toObject(),
    path:
      item.path && item.path.startsWith('/')
        ? item.path
        : `/api/collab/files/${String(item._id)}/download`,
  };
}

function hasMemberManagementAccess(user) {
  return ['team_leader', 'manager', 'admin'].includes(String(user?.role || ''));
}

function formatDueDate(dueDate) {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function createTaskAssignmentNotification({
  actor,
  receiverId,
  task,
  project,
  action = 'assigned',
  io,
}) {
  if (!isObjectId(receiverId) || !task) return null;

  const actorName = String(actor?.name || 'A team member').trim() || 'A team member';
  const projectName = String(project?.name || 'your project').trim() || 'your project';
  const dueLabel = formatDueDate(task.dueDate);

  const notification = await Notification.create({
    receiverId,
    senderId: actor?._id || null,
    projectId: task.projectId || project?._id || null,
    taskId: task._id,
    type: 'task',
    title: action === 'reassigned' ? 'Task reassigned to you' : 'Task assigned to you',
    message: `${actorName} ${action} "${task.title}" in ${projectName}${dueLabel ? ` (Due ${dueLabel})` : ''}.`,
    read: false,
  });

  if (io) {
    io.to(`user:${String(receiverId)}`).emit('notification:new', notification);
  }

  return notification;
}

router.use(requireAuth);

router.get('/users', async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(
    users.map((user) => ({
      _id: String(user._id),
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceName: user.workspaceName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  );
});

router.post('/users', async (req, res, next) => {
  try {
    if (!hasMemberManagementAccess(req.user)) {
      const error = new Error('Not authorized to add members');
      error.statusCode = 403;
      throw error;
    }

    const { name, email, password, role, workspaceName, phone } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: ['team_leader', 'manager', 'member', 'admin'].includes(role) ? role : 'member',
      workspaceName: String(workspaceName || req.user.workspaceName || '').trim() || 'Team Workspace',
      phone: String(phone || '').trim(),
    });

    res.status(201).json({
      _id: String(user._id),
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      workspaceName: user.workspaceName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:userId', async (req, res, next) => {
  try {
    if (!hasMemberManagementAccess(req.user)) {
      const error = new Error('Not authorized to delete members');
      error.statusCode = 403;
      throw error;
    }

    const userId = String(req.params.userId || '');
    if (!isObjectId(userId)) {
      const error = new Error('Invalid user id');
      error.statusCode = 400;
      throw error;
    }

    if (String(req.user._id) === userId) {
      const error = new Error('You cannot delete your own account');
      error.statusCode = 400;
      throw error;
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      const error = new Error('Member not found');
      error.statusCode = 404;
      throw error;
    }

    await Promise.all([
      RefreshToken.deleteMany({ userId }),
      Notification.deleteMany({ $or: [{ receiverId: userId }, { senderId: userId }] }),
      Task.updateMany({ assigneeId: userId }, { $set: { assigneeId: null } }),
      Project.updateMany({ ownerId: userId }, { $set: { ownerId: req.user._id } }),
      Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
    ]);

    res.json({ message: 'Member deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (req, res) => {
  const projects = await Project.find().sort({ updatedAt: -1 });
  res.json(projects);
});

router.post('/projects', async (req, res, next) => {
  try {
    const project = await Project.create({
      name: String(req.body.name || '').trim(),
      description: String(req.body.description || '').trim(),
      status: req.body.status || 'active',
      ownerId: isObjectId(req.body.ownerId) ? req.body.ownerId : req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.get('/tasks', async (req, res) => {
  const query = {};
  if (isObjectId(req.query.projectId)) {
    query.projectId = req.query.projectId;
  }
  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/tasks', async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const task = await Task.create({
      projectId: project._id,
      title: String(req.body.title || '').trim(),
      assigneeId: isObjectId(req.body.assigneeId) ? req.body.assigneeId : null,
      dueDate: req.body.dueDate || null,
      completed: Boolean(req.body.completed),
    });

    if (task.assigneeId) {
      await createTaskAssignmentNotification({
        actor: req.user,
        receiverId: task.assigneeId,
        task,
        project,
        action: 'assigned',
        io: req.app.get('io'),
      });
    }

    // Emit real-time task creation event
    const io = req.app.get('io');
    if (io) {
      // Emit to all users who have access to this project
      const projectMembers = await Task.find({ projectId: project._id }).distinct('assigneeId');
      const uniqueMembers = [...new Set([project.ownerId, ...projectMembers].filter(Boolean))];

      uniqueMembers.forEach(memberId => {
        io.to(`user:${String(memberId)}`).emit('task:created', {
          task,
          project: { _id: project._id, name: project.name }
        });
      });
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/tasks/:taskId', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const previousAssigneeId = String(task.assigneeId || '');
    const wasCompleted = task.completed;

    if (typeof req.body.title === 'string') task.title = req.body.title.trim() || task.title;
    if ('completed' in req.body) task.completed = Boolean(req.body.completed);
    if ('assigneeId' in req.body) task.assigneeId = isObjectId(req.body.assigneeId) ? req.body.assigneeId : null;
    if ('dueDate' in req.body) task.dueDate = req.body.dueDate || null;

    await task.save();

    const nextAssigneeId = String(task.assigneeId || '');
    if (nextAssigneeId && nextAssigneeId !== previousAssigneeId) {
      const project = await Project.findById(task.projectId);
      await createTaskAssignmentNotification({
        actor: req.user,
        receiverId: task.assigneeId,
        task,
        project,
        action: previousAssigneeId ? 'reassigned' : 'assigned',
        io: req.app.get('io'),
      });
    }

    // Emit real-time task update event
    const io = req.app.get('io');
    if (io) {
      const project = await Project.findById(task.projectId);
      const projectMembers = await Task.find({ projectId: task.projectId }).distinct('assigneeId');
      const uniqueMembers = [...new Set([project.ownerId, ...projectMembers].filter(Boolean))];

      const eventType = task.completed && !wasCompleted ? 'task:completed' :
                       !task.completed && wasCompleted ? 'task:reopened' : 'task:updated';

      uniqueMembers.forEach(memberId => {
        io.to(`user:${String(memberId)}`).emit(eventType, {
          task,
          project: { _id: project._id, name: project.name },
          changes: {
            completed: task.completed !== wasCompleted,
            assigneeChanged: nextAssigneeId !== previousAssigneeId
          }
        });
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.get('/notifications', async (req, res) => {
  const notifications = await Notification.find({ receiverId: req.user._id }).sort({ createdAt: -1 }).limit(200);
  res.json(notifications);
});

router.put('/notifications/read-all', async (req, res) => {
  await Notification.updateMany({ receiverId: req.user._id, read: false }, { $set: { read: true } });
  res.json({ message: 'All notifications marked as read' });
});

router.put('/notifications/:notificationId/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      receiverId: req.user._id,
    });

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

router.delete('/notifications', async (req, res) => {
  await Notification.deleteMany({ receiverId: req.user._id });
  res.json({ message: 'Notifications cleared' });
});

router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = String(req.user.role || 'member');

    // Get all projects (filtered by access level)
    let projectsQuery = {};
    if (!['team_leader', 'manager', 'admin'].includes(userRole)) {
      // Regular members only see projects they own or are assigned to tasks in
      const userTasks = await Task.find({ assigneeId: userId }).distinct('projectId');
      projectsQuery = {
        $or: [
          { ownerId: userId },
          { _id: { $in: userTasks } }
        ]
      };
    }
    const projects = await Project.find(projectsQuery);

    // Get all tasks for user's accessible projects
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } });

    // Get all users (for team member count)
    const users = await User.find();

    // Get recent messages (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let messagesQuery = { createdAt: { $gte: thirtyDaysAgo } };
    if (!['team_leader', 'manager', 'admin'].includes(userRole)) {
      // Regular members only see messages in their projects
      messagesQuery.projectId = { $in: projectIds };
    }
    const messages = await Message.find(messagesQuery);

    // Calculate metrics
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const activeUsers = users.filter(u => u.isActive !== false).length;

    // Calculate completion rate (tasks completed in last 30 days)
    const recentCompletedTasks = tasks.filter(t =>
      t.completed && new Date(t.updatedAt || t.createdAt) >= thirtyDaysAgo
    ).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate activity trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTasks = tasks.filter(t => new Date(t.createdAt) >= sevenDaysAgo).length;
    const recentMessages = messages.filter(m => new Date(m.createdAt) >= sevenDaysAgo).length;

    // Calculate task completion trend
    const previousPeriodTasks = tasks.filter(t =>
      new Date(t.createdAt) >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000) &&
      new Date(t.createdAt) < sevenDaysAgo
    ).length;
    const taskChange = previousPeriodTasks > 0 ?
      Math.round(((recentTasks - previousPeriodTasks) / previousPeriodTasks) * 100) : 0;

    const analytics = {
      metrics: {
        activeProjects: {
          value: activeProjects,
          change: `+${projects.length - activeProjects} inactive`,
          trend: activeProjects > projects.length * 0.5 ? 'up' : 'down'
        },
        teamMembers: {
          value: activeUsers,
          change: `+${users.length - activeUsers} inactive`,
          trend: 'stable'
        },
        tasksCompleted: {
          value: completedTasks,
          change: `+${recentCompletedTasks} this month`,
          trend: completedTasks > totalTasks * 0.5 ? 'up' : 'down'
        },
        completionRate: {
          value: `${completionRate}%`,
          change: `+${taskChange > 0 ? taskChange : 0}% this week`,
          trend: taskChange > 0 ? 'up' : 'down'
        }
      },
      recentActivity: messages.slice(-5).map(message => ({
        time: message.createdAt,
        action: 'Message posted',
        details: message.body?.substring(0, 50) + (message.body?.length > 50 ? '...' : ''),
        projectId: message.projectId,
        userId: message.senderId
      })).concat(
        tasks.filter(t => new Date(t.createdAt) >= sevenDaysAgo).slice(-3).map(task => ({
          time: task.createdAt,
          action: task.completed ? 'Task completed' : 'Task created',
          details: task.title,
          projectId: task.projectId,
          userId: task.assigneeId
        }))
      ).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8),
      projectStats: projects.map(project => ({
        id: project._id,
        name: project.name,
        status: project.status,
        taskCount: tasks.filter(t => String(t.projectId) === String(project._id)).length,
        completedTasks: tasks.filter(t => String(t.projectId) === String(project._id) && t.completed).length,
        activeMembers: [...new Set(tasks
          .filter(t => String(t.projectId) === String(project._id))
          .map(t => t.assigneeId)
          .filter(Boolean)
        )].length
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

router.get('/messages', async (req, res) => {
  const { projectId, userId, peerId } = req.query;
  let query = {};

  if (isObjectId(projectId)) {
    query.projectId = projectId;
  } else if (isObjectId(userId) && isObjectId(peerId)) {
    query = {
      $or: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId },
      ],
    };
  } else if (isObjectId(userId)) {
    query = {
      $or: [{ senderId: userId }, { receiverId: userId }],
    };
  }

  const messages = await Message.find(query).sort({ createdAt: -1 }).limit(200);
  res.json(messages);
});

router.post('/messages', async (req, res, next) => {
  try {
    const message = await Message.create({
      projectId: isObjectId(req.body.projectId) ? req.body.projectId : null,
      senderId: isObjectId(req.body.senderId) ? req.body.senderId : req.user._id,
      receiverId: isObjectId(req.body.receiverId) ? req.body.receiverId : null,
      body: String(req.body.body || '').trim(),
    });

    const io = req.app.get('io');
    if (io) {
      if (message.projectId) {
        io.to(`project:${String(message.projectId)}`).emit('project_message:new', message);
      }
      if (message.receiverId) {
        io.to(`user:${String(message.receiverId)}`).emit('direct_message:new', message);
      }
      io.to(`user:${String(message.senderId)}`).emit('direct_message:new', message);
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

router.get('/files', async (req, res) => {
  const files = await FileItem.find().sort({ updatedAt: -1 });
  res.json(files.map(normalizeFile));
});

router.post('/files', async (req, res, next) => {
  try {
    const created = await FileItem.create({
      projectId: isObjectId(req.body.projectId) ? req.body.projectId : null,
      uploaderId: isObjectId(req.body.uploaderId) ? req.body.uploaderId : req.user._id,
      fileName: String(req.body.fileName || '').trim(),
      path: String(req.body.path || '').trim(),
      mimeType: String(req.body.mimeType || '').trim(),
      sizeBytes: Number(req.body.sizeBytes || 0),
    });

    res.status(201).json(normalizeFile(created));
  } catch (error) {
    next(error);
  }
});

router.get('/files/:fileId/download', async (req, res, next) => {
  try {
    const file = await FileItem.findById(req.params.fileId);
    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      message: 'File metadata only. No binary upload storage is configured yet.',
      file: normalizeFile(file),
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/files/:fileId', async (req, res, next) => {
  try {
    const file = await FileItem.findByIdAndDelete(req.params.fileId);
    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'File deleted' });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:userId', async (req, res, next) => {
  try {
    // Prevent users from deleting themselves
    if (req.params.userId === String(req.user._id)) {
      const error = new Error('Cannot delete your own account');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
