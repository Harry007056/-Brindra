const mongoose = require('mongoose');
const Plan = require('../models/Plans');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brindra';

const plansData = [
  {
    id: 'demo',
    name: 'Demo',
    price: 'Free',
    period: '7-day trial',
    desc: 'Explore core features with a guided demo workspace.',
    detail: 'Validate workflow fit, test collaboration basics, and understand team adoption before paid rollout.',
    cta: 'Start Demo Free',
    bestFor: 'Evaluation and pilot testing',
    pricePerMember: 0,
    memberRule: 'Up to 5 members',
    features: [
      'Dashboard overview',
      'Project list and basic milestone tracking',
      'Sample workspace data',
      'Guided onboarding flow'
    ],
    limitations: [
      'Limited to 5 team members',
      'No private chat history export',
      'No file module access'
    ],
    popular: false,
    maxMembers: 5
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '₹420',
    period: 'per user / month',
    desc: 'Small teams testing collaboration in real projects.',
    detail: 'Run live projects with core messaging and ownership while keeping cost predictable for early teams.',
    cta: 'Get Started',
    bestFor: 'Small internal teams',
    pricePerMember: 420,
    memberRule: 'Up to 15 members',
    features: [
      'Everything in Demo',
      'Team members page',
      'Project group chat',
      'Basic notifications and alerts'
    ],
    limitations: [
      'Up to 15 members',
      'Limited file storage (5 GB workspace)',
      'No advanced settings controls'
    ],
    popular: false,
    maxMembers: 15
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹1,000',
    period: 'per user / month',
    desc: 'For teams scaling projects, communication, and workflows.',
    detail: 'Unlock faster coordination with richer collaboration modules and better visibility across active work.',
    cta: 'Choose Growth',
    bestFor: 'Growing teams and delivery squads',
    pricePerMember: 1000,
    memberRule: 'Up to 75 members',
    features: [
      'Everything in Starter',
      'Files module (upload, share, download, delete)',
      'Private 1-on-1 chat with history',
      'Team spaces and advanced collaboration views'
    ],
    limitations: [
      'Up to 75 members',
      'Standard support SLA',
      'No dedicated account manager'
    ],
    popular: true,
    maxMembers: 75
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    desc: 'Advanced controls, scale, and dedicated support.',
    detail: 'Built for complex organizations needing governance, onboarding support, and high-confidence operations.',
    cta: 'Contact Sales',
    bestFor: 'Large organizations',
    pricePerMember: 0,
    memberRule: 'Above 75 members',
    features: [
      'Everything in Growth',
      'Full settings and role governance',
      'Priority support and onboarding',
      'Custom security and policy controls'
    ],
    limitations: [
      'Contract-based pricing',
      'Implementation scope based on agreement',
      'Custom integrations by package'
    ],
    popular: false
  }
];

async function seedPlans() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert new plans
    await Plan.insertMany(plansData);
    console.log('✅ Seeded', plansData.length, 'plans successfully');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedPlans();

