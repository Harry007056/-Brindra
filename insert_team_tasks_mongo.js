// Direct MongoDB insert for Brindra team collab tasks (no Mongoose)
const { MongoClient } = require('mongodb');

async function insertTeamCollabTasks() {
  const uri = 'mongodb://127.0.0.1:27017/brindra'; // or your Atlas URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('brindra');
    
    // Assume users exist, or create sample (use ObjectId for refs)
    const usersColl = db.collection('users');\n    const projectsColl = db.collection('projects');\n    const tasksColl = db.collection('tasks');\n    \n    // Create Harsh team (custom names)\n    const harshCount = await usersColl.countDocuments({email: {$in: ['harsh@teamcollab.com', 'harsha@teamcollab.com', 'priya@teamcollab.com']}});\n    if (harshCount === 0) {\n      await usersColl.insertMany([\n        {\n          name: 'Team Lead Harsh',\n          email: 'harsh@teamcollab.com',\n          passwordHash: '$2b$10$K.ExampleHashForHarsh',\n          role: 'team_leader',\n          workspaceName: 'Brindra Team Collab',\n          isActive: true\n        },\n        {\n          name: 'Manager Priya',\n          email: 'priya@teamcollab.com',\n          passwordHash: '$2b$10$K.ExampleHashForPriya',\n          role: 'manager',\n          workspaceName: 'Brindra Team Collab',\n          isActive: true\n        },\n        {\n          name: 'Member Harsha',\n          email: 'harsha@teamcollab.com',\n          passwordHash: '$2b$10$K.ExampleHashForHarsha',\n          role: 'member',\n          workspaceName: 'Brindra Team Collab',\n          isActive: true\n        }\n      ]);\n      console.log('✅ Created Team Lead Harsh, Manager Priya, Member Harsha');\n    }
    
    // Create Team Collab project
    const project = {
      name: 'Team Collab Platform',
      description: 'Brindra team collaboration project management',
      status: 'active',
      ownerId: new ObjectId("507f1f77bcf86cd799439011"), // team leader
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await projectsColl.insertOne(project);
    const projectId = project.insertedId;
    console.log(`✅ Created Team Collab project ID: ${projectId}`);
    
    // Give tasks to each role
    await tasksColl.insertMany([
      {
        projectId,
        title: 'Lead sprint planning meeting',
        assigneeId: new ObjectId("507f1f77bcf86cd799439011"), // Team Leader
        dueDate: new Date(Date.now() + 3*24*60*60*1000),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        projectId,
        title: 'Review PRs and merge code',
        assigneeId: new ObjectId("507f1f77bcf86cd799439012"), // Manager
        dueDate: new Date(Date.now() + 2*24*60*60*1000),
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        projectId,
        title: 'Implement task assignment UI',
        assigneeId: new ObjectId("507f1f77bcf86cd799439013"), // Member
        dueDate: new Date(Date.now() + 5*24*60*60*1000),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log('✅ Tasks assigned: Team Leader (sprint), Manager (PRs ✓), Member (UI)');
    console.log('Login any @teamcollab.com / any password → /tasks');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

insertTeamCollabTasks();

