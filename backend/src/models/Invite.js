import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'manager', 'member'], default: 'member' },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

inviteSchema.index({ workspaceId: 1, email: 1, acceptedAt: 1 });

export const Invite = mongoose.model('Invite', inviteSchema);
