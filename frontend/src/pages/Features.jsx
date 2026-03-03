import { Bell, CalendarClock, FolderKanban, MessageSquare, ShieldCheck, Users } from 'lucide-react';

const items = [
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    desc: 'Fast team communication with focused threads and context.',
  },
  {
    icon: FolderKanban,
    title: 'Project Tracking',
    desc: 'Plan and manage tasks with clear ownership and progress.',
  },
  {
    icon: Users,
    title: 'Team Spaces',
    desc: 'Keep departments organized while staying cross-functional.',
  },
  {
    icon: CalendarClock,
    title: 'Milestones & Deadlines',
    desc: 'Track due dates, assign ownership, and stay ahead with smart reminders.',
  },
  {
    icon: Bell,
    title: 'Activity Notifications',
    desc: 'Get timely updates for messages, task changes, and key project events.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    desc: 'Team leaders, managers, and members see the right tools at the right time.',
  },
];

const workflows = [
  {
    title: 'Plan',
    desc: 'Create projects, add milestones, and assign responsibilities in minutes.',
  },
  {
    title: 'Collaborate',
    desc: 'Use real-time group and private chat to resolve blockers without delays.',
  },
  {
    title: 'Deliver',
    desc: 'Monitor progress, complete tasks, and keep teams accountable to deadlines.',
  },
];

const featuresByPlan = [
  {
    plan: 'Demo',
    period: 'Free / 7-day trial',
    includes: ['Dashboard overview', 'Projects basics', 'Guided onboarding'],
  },
  {
    plan: 'Starter',
    period: '$5 per user / month',
    includes: ['Everything in Demo', 'Team members', 'Messages', 'Basic alerts'],
  },
  {
    plan: 'Growth',
    period: '$12 per user / month',
    includes: ['Everything in Starter', 'Files module', 'Private 1-on-1 chat', 'Team spaces'],
  },
  {
    plan: 'Enterprise',
    period: 'Custom / annual',
    includes: ['Everything in Growth', 'Advanced settings', 'Governance controls', 'Priority support'],
  },
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Features</h1>
        <p className="mt-2 text-text-default">
          Everything your team needs to collaborate smoothly, from planning and communication to delivery and reporting.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-primary-soft-sky/20 p-2 text-primary-dusty-blue">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-accent-warm-grey">{item.title}</h2>
              <p className="mt-1 text-sm text-text-default">{item.desc}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-accent-warm-grey">How Teams Use Brindra</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {workflows.map((step, index) => (
            <article key={step.title} className="rounded-xl bg-background-light-sand p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-dusty-blue">Step {index + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-accent-warm-grey">{step.title}</h3>
              <p className="mt-1 text-sm text-text-default">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-accent-warm-grey">Features Included by Plan</h2>
        <p className="mt-2 text-sm text-text-default">
          Website features are unlocked based on the selected pricing plan.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuresByPlan.map((item) => (
            <article key={item.plan} className="rounded-xl border border-[#88C0D0]/25 bg-background-light-sand p-4">
              <h3 className="text-sm font-semibold text-accent-warm-grey">{item.plan}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-dusty-blue">{item.period}</p>
              <ul className="mt-2 space-y-1.5 text-xs text-text-default">
                {item.includes.map((entry) => (
                  <li key={entry}>- {entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
