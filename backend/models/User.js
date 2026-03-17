const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["team_leader", "manager", "member"],
      default: "member"
    },
    workspaceName: { type: String, default: "Team Workspace", trim: true },
    avatarUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    currentPlan: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Plan' 
    },
    planActivatedAt: { type: Date },
    planExpiryDate: { type: Date },
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
      },
      security: {
        twoFactorEnabled: { type: Boolean, default: false }
      },
      appearance: {
        theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
        accentColor: { type: String, default: "#5E81AC" }
      },
      language: {
        displayLanguage: { type: String, default: "English (US)" },
        timeZone: { type: String, default: "Asia/Kolkata" },
        dateFormat: { type: String, default: "MM/DD/YYYY" }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
