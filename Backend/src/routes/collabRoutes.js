const express = require('express');
const mongoose = require('mongoose');

const { requireAuth } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Message = require('../models/Message');
const FileItem = require('../models/FileItem');

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
    const task = await Task.create({
      projectId: req.body.projectId,
      title: String(req.body.title || '').trim(),
      assigneeId: isObjectId(req.body.assigneeId) ? req.body.assigneeId : null,
      dueDate: req.body.dueDate || null,
      completed: Boolean(req.body.completed),
    });

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

    if (typeof req.body.title === 'string') task.title = req.body.title.trim() || task.title;
    if ('completed' in req.body) task.completed = Boolean(req.body.completed);
    if ('assigneeId' in req.body) task.assigneeId = isObjectId(req.body.assigneeId) ? req.body.assigneeId : null;
    if ('dueDate' in req.body) task.dueDate = req.body.dueDate || null;

    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
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
