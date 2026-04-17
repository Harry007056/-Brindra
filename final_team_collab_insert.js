// Final Brindra MongoDB script: Team Lead Harsh, Manager Priya, Member Harsha + Tasks
const { MongoClient, ObjectId } = require('mongodb');

async function insertFinalTeamTasks() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brindra';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('brindra');
    const users = db.collection('users');
    const projects = db.collection('projects');
    const tasks = db.collection('tasks');

    // Insert team members if not exist (exact names/emails)
    const existing = await users.find({email: {$in: ['harsh@brindra.com', 'priya@brindra.com', 'harsha@brindra.com']}}).toArray();
    if (existing.length === 0) {
      const teamMembers = await users.insertMany([
        {
          _id: new ObjectId('650000000000000000000001'),
          name: 'Team Lead Harsh',
          email: 'harsh@brindra.com',
          passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'team_leader',
          workspaceName: 'Brindra Team',
          phone: '+91 9876543210',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId('650000000000000000000002'),
          name: 'Manager Priya',
          email: 'priya@brindra.com',
          passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'manager',
          workspaceName: 'Brindra Team',
          phone: '+91 9876543211',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId('650000000000000000000003'),
          name: 'Member Harsha',
          email: 'harsha@brindra.com',
          passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'member',
          workspaceName: 'Brindra Team',
          phone: '+91 9876543212',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log('✅ Team inserted: Harsh (lead), Priya (manager), Harsha (member)');
    }

    // Brindra team collab project
    const projectDoc = await projects.findOne({name: 'Brindra Team Collab'});
    let projectId;
    if (!projectDoc) {
      const result = await projects.insertOne({
        name: 'Brindra Team Collab',
        description: 'Official team collaboration project',
        status: 'active',
        ownerId: new ObjectId('650000000000000000000001'), // Harsh
        createdAt: new Date(),
        updatedAt: new Date()
      });
      projectId = result.insertedId;
      console.log('✅ Project created:', projectId);
    } else {
      projectId = projectDoc._id;
    }

    // Insert/upsert tasks assigned to each
    await tasks.deleteMany({projectId}); // Clear old
    await tasks.insertMany([
      {
        projectId,
        title: 'Lead daily standup and sprint planning',
        assigneeId: new ObjectId('650000000000000000000001'), // Team Lead Harsh
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        projectId,
        title: 'Code review and merge team PRs',
        assigneeId: new ObjectId('650000000000000000000002'), // Manager Priya
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
        completed: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        projectId,
        title: 'Develop task assignee dropdown UI',
        assigneeId: new ObjectId('650000000000000000000003'), // Member Harsha
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log(`
✅ FINAL: Tasks assigned in MongoDB brindra collection!
Team Lead Harsh: "Lead daily standup" (due tomorrow)
Manager Priya: "Code review PRs" (completed, was overdue) 
Member Harsha: "Task assignee UI" (due +4d)

RUN: node Backend/server.js (backend) + frontend dev
Login: harsh@brindra.com / password (or register)
Visit /tasks → collab works!
    `);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.close();
  }
}

insertFinalTeamTasks();

