const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['team_leader', 'manager', 'member', 'admin'],
      default: 'member',
    },
    workspaceName: {
      type: String,
      default: 'Team Workspace',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
      },
      security: {
        twoFactorEnabled: { type: Boolean, default: false },
      },
      appearance: {
        theme: { type: String, default: 'dark' },
        accentColor: { type: String, default: '#5E81AC' },
      },
      language: {
        displayLanguage: { type: String, default: 'English (US)' },
        timeZone: { type: String, default: 'Asia/Kolkata' },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
