require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Project = require("../models/Project");
const TaskItem = require("../models/TaskItem");
const Message = require("../models/Message");
const FileResource = require("../models/FileResource");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in Backend/.env");
  process.exit(1);
}

async function upsertUser({ name, email, role, workspaceName, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email: normalizedEmail,
      password: hash,
      role,
      workspaceName,
      isActive: true,
    });
    return user;
  }

  user.name = name;
  user.role = role;
  user.workspaceName = workspaceName;
  user.isActive = true;
  await user.save();
  return user;
}

async function upsertProject({ name, ownerId, description, status }) {
  let project = await Project.findOne({ name, ownerId });
  if (!project) {
    project = await Project.create({ name, ownerId, description, status });
  }
  return project;
}

async function upsertTask({ projectId, title, description, assigneeId, completed, dueDate }) {
  let task = await TaskItem.findOne({ projectId, title });
  if (!task) {
    task = await TaskItem.create({ projectId, title, description, assigneeId, completed, dueDate });
  }
  return task;
}

async function upsertMessage({ projectId, senderId, body }) {
  let message = await Message.findOne({ projectId, body });
  if (!message) {
    message = await Message.create({ projectId, senderId, body });
  }
  return message;
}

async function upsertFile({ projectId, uploaderId, fileName, path, mimeType, sizeBytes }) {
  let file = await FileResource.findOne({ projectId, fileName, path });
  if (!file) {
    file = await FileResource.create({ projectId, uploaderId, fileName, path, mimeType, sizeBytes });
  }
  return file;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding");

  const [leader, manager, member] = await Promise.all([
    upsertUser({
      name: "Harshal Thorat",
      email: "leader@brindra.com",
      role: "team_leader",
      workspaceName: "Brindra Core Team",
      password: "Password123!",
    }),
    upsertUser({
      name: "Priya Sharma",
      email: "manager@brindra.com",
      role: "manager",
      workspaceName: "Brindra Core Team",
      password: "Password123!",
    }),
    upsertUser({
      name: "Aman Verma",
      email: "member@brindra.com",
      role: "member",
      workspaceName: "Brindra Core Team",
      password: "Password123!",
    }),
  ]);

  const projectA = await upsertProject({
    name: "Brindra Web App",
    ownerId: leader._id,
    description: "Main collaboration platform for teams",
    status: "active",
  });

  const projectB = await upsertProject({
    name: "Mobile Companion App",
    ownerId: manager._id,
    description: "Mobile-first experience for project updates",
    status: "active",
  });

  await Promise.all([
    upsertTask({
      projectId: projectA._id,
      title: "Finalize dashboard widgets",
      description: "Polish metrics cards and activity chart",
      assigneeId: member._id,
      completed: false,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),
    upsertTask({
      projectId: projectA._id,
      title: "Implement role-based settings access",
      description: "Only team leader and manager can access settings",
      assigneeId: manager._id,
      completed: true,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }),
    upsertTask({
      projectId: projectB._id,
      title: "Create login/register screens",
      description: "Add role selection in auth flow",
      assigneeId: member._id,
      completed: true,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }),
  ]);

  await Promise.all([
    upsertMessage({
      projectId: projectA._id,
      senderId: leader._id,
      body: "Team, let's finish the dashboard by Friday.",
    }),
    upsertMessage({
      projectId: projectA._id,
      senderId: manager._id,
      body: "Settings page now respects roles.",
    }),
    upsertMessage({
      projectId: projectB._id,
      senderId: member._id,
      body: "Auth role dropdown is ready for testing.",
    }),
  ]);

  await Promise.all([
    upsertFile({
      projectId: projectA._id,
      uploaderId: manager._id,
      fileName: "dashboard-wireframe.pdf",
      path: "/uploads/dashboard-wireframe.pdf",
      mimeType: "application/pdf",
      sizeBytes: 248320,
    }),
    upsertFile({
      projectId: projectA._id,
      uploaderId: member._id,
      fileName: "theme-guidelines.docx",
      path: "/uploads/theme-guidelines.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      sizeBytes: 83412,
    }),
    upsertFile({
      projectId: projectB._id,
      uploaderId: leader._id,
      fileName: "mobile-auth-flow.png",
      path: "/uploads/mobile-auth-flow.png",
      mimeType: "image/png",
      sizeBytes: 126044,
    }),
  ]);

  const counts = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    TaskItem.countDocuments(),
    Message.countDocuments(),
    FileResource.countDocuments(),
  ]);

  console.log("Seed complete");
  console.log(`Users: ${counts[0]}`);
  console.log(`Projects: ${counts[1]}`);
  console.log(`TaskItems: ${counts[2]}`);
  console.log(`Messages: ${counts[3]}`);
  console.log(`FileResources: ${counts[4]}`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
