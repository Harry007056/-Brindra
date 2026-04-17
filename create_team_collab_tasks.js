const mongoose = require('mongoose');
const connectToDatabase = require('./Backend/src/config/db');
const Task = require('./Backend/src/models/Task');
const Project = require('./Backend/src/models/Project');
const User = require('./Backend/src/models/User');

async function seedBrindraTasks() {
  await connectToDatabase();
  
  // Clear existing
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  
  // Create team users
  const users = await User.create([
    { name: 'Team Lead Alice', email: 'alice@brindra.com', passwordHash: '$2a$10$examplehash', role: 'team_leader', workspaceName: 'Brindra Team' },
    { name: 'Manager Bob', email: 'bob@brindra.com', passwordHash: '$2a$10$examplehash', role: 'manager', workspaceName: 'Brindra Team' },
    { name: 'Developer Carol', email: 'carol@brindra.com', passwordHash: '$2a$10$examplehash', role: 'member', workspaceName: 'Brindra Team' },
    { name: 'Designer David', email: 'david@brindra.com', passwordHash: '$2a$10$examplehash', role: 'member', workspaceName: 'Brindra Team' }
  ]);
  
  // Create projects
  const projects = await Project.create([
    { name: 'Brindra Frontend V2', description: 'Upgrade UI/UX for collaboration platform', ownerId: users[0]._id },
    { name: 'Backend API Optimization', description: 'Performance and security improvements', ownerId: users[1]._id }
  ]);
  
  // Create team collab tasks (Brindra project tasks)
  await Task.create([
    // Project 1 Tasks
    { projectId: projects[0]._id, title: 'Design new dashboard layout', assigneeId: users[3]._id, dueDate: new Date(Date.now() + 7*24*60*60*1000), completed: false },
    { projectId: projects[0]._id, title: 'Implement real-time notifications', assigneeId: users[2]._id, dueDate: new Date(Date.now() + 5*24*60*60*1000), completed: true },
    { projectId: projects[0]._id, title: 'Mobile responsive fixes', assigneeId: users[1]._id, dueDate: new Date(Date.now() - 1*24*60*60*1000), completed: false }, // Overdue
    
    // Project 2 Tasks
    { projectId: projects[1]._id, title: 'MongoDB query optimization', assigneeId: users[0]._id, dueDate: new Date(Date.now() + 3*24*60*60*1000), completed: false },
    { projectId: projects[1]._id, title: 'Socket.IO scalability testing', assigneeId: users[2]._id, dueDate: new Date(Date.now() + 10*24*60*60*1000), completed: false },
    { projectId: projects[1]._id, title: 'API rate limiting', assigneeId: users[3]._id, dueDate: new Date(Date.now() + 2*24*60*60*1000), completed: true }
  ]);
  
  console.log('✅ 4 Brindra team members, 2 projects, 6 collab tasks inserted into DB collections!');
  console.log('Login: alice@brindra.com (any password)');
  console.log('Visit /tasks to see team collaboration in action!');
  process.exit(0);
}

seedBrindraTasks().catch(console.error);

