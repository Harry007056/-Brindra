const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectToDatabase = require('./src/config/db');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');
const Message = require('./src/models/Message');
const FileItem = require('./src/models/FileItem');

async function run() {
  await connectToDatabase();

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Message.deleteMany({}),
    FileItem.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);

  const [lead, manager, member] = await User.create([
    {
      name: 'Harshal Thorat',
      email: 'lead@brindra.com',
      passwordHash,
      role: 'team_leader',
      workspaceName: 'Brindra Workspace',
      settings: {},
    },
    {
      name: 'Ava Manager',
      email: 'manager@brindra.com',
      passwordHash,
      role: 'manager',
      workspaceName: 'Brindra Workspace',
      settings: {},
    },
    {
      name: 'Noah Member',
      email: 'member@brindra.com',
      passwordHash,
      role: 'member',
      workspaceName: 'Brindra Workspace',
      settings: {},
    },
  ]);

  const [projectA, projectB] = await Project.create([
    {
      name: 'Website Revamp',
      description: 'Refresh the Brindra experience across web surfaces.',
      status: 'active',
      ownerId: lead._id,
    },
    {
      name: 'Mobile Planning',
      description: 'Prepare the next mobile roadmap and design review.',
      status: 'active',
      ownerId: manager._id,
    },
  ]);

const [taskA, taskB, taskC, taskD, taskE, taskF] = await Task.create([
    {
      projectId: projectA._id,
      title: 'Build login flow',
      assigneeId: member._id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      projectId: projectA._id,
      title: 'Prepare dashboard cards',
      assigneeId: manager._id,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      completed: true,
    },
    {
      projectId: projectB._id,
      title: 'Collect launch requirements',
      assigneeId: lead._id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      projectId: projectA._id,
      title: 'Review accessibility standards',
      assigneeId: null, // Unassigned
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
      completed: false,
    },
    {
      projectId: projectB._id,
      title: 'Prototype navigation flows',
      assigneeId: member._id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      projectId: projectA._id,
      title: 'Performance optimization review',
      assigneeId: manager._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completed: true,
    },
  ]);

  await Message.create([
    {
      projectId: projectA._id,
      senderId: lead._id,
      body: 'Kickoff looks good. Let us push this this week.',
    },
    {
      projectId: projectA._id,
      senderId: member._id,
      body: 'I started wiring the auth screens.',
    },
    {
      senderId: manager._id,
      receiverId: member._id,
      projectId: projectA._id,
      body: 'Please share the latest login mockups.',
    },
  ]);

  await FileItem.create([
    {
      projectId: projectA._id,
      uploaderId: lead._id,
      fileName: 'requirements.pdf',
      path: '/assets/requirements.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 204800,
    },
    {
      projectId: projectB._id,
      uploaderId: manager._id,
      fileName: 'roadmap.xlsx',
      path: '/assets/roadmap.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sizeBytes: 102400,
    },
  ]);

  console.log('Seed complete');
  console.log('Login with: lead@brindra.com / password123');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
