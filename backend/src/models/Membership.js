import mongoose from 'mongoose';

export const roles = ['admin', 'manager', 'member'];

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: { type: String, enum: roles, default: 'member' },
    status: { type: String, enum: ['active', 'invited', 'disabled'], default: 'active' },
  },
  { timestamps: true }
);

membershipSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

export const Membership = mongoose.model('Membership', membershipSchema);
