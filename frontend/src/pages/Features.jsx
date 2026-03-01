import { MessageSquare, FolderKanban, Users } from 'lucide-react';

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
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Features</h1>
        <p className="mt-2 text-text-default">Everything your team needs to collaborate smoothly.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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
    </div>
  );
}

