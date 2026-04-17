const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    targetType: {
      type: String,
      enum: ['task', 'project', 'message', 'file', 'deadline', 'generic', null],
      default: null,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    route: {
      type: String,
      default: '',
      trim: true,
    },
    actorName: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['task', 'mention', 'project', 'file', 'deadline'],
      default: 'task',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    seenAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    dedupeKey: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ receiverId: 1, deletedAt: 1, createdAt: -1, _id: -1 });
NotificationSchema.index({ receiverId: 1, read: 1, deletedAt: 1, createdAt: -1, _id: -1 });
NotificationSchema.index({ receiverId: 1, archivedAt: 1, deletedAt: 1, createdAt: -1, _id: -1 });
NotificationSchema.index({ receiverId: 1, type: 1, deletedAt: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
