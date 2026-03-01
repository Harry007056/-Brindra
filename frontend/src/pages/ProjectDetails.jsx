import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Edit3, MessageSquare, Trash2, Users } from 'lucide-react';

const relatedMessages = [
  { id: 1, sender: 'Sarah Chen', text: 'Updated the hero section mockups for review.', time: '2h ago' },
  { id: 2, sender: 'Mike Ross', text: 'API integration for project metrics is completed.', time: '6h ago' },
  { id: 3, sender: 'Emma Davis', text: 'Client approved timeline for next sprint.', time: 'Yesterday' },
];

const milestones = [
  { id: 1, title: 'Research & Discovery', done: true },
  { id: 2, title: 'Design System Update', done: true },
  { id: 3, title: 'Frontend Implementation', done: false },
  { id: 4, title: 'QA & Launch', done: false },
];

export default function ProjectDetails({ setActiveView }) {
  const progress = 68;
  const projectId = localStorage.getItem('selectedProject');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <button
            className="text-primary-dusty-blue hover:text-primary-soft-sky mb-2 text-sm"
            onClick={() => setActiveView('projects')}
          >
            ← Back
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-accent-warm-grey">Project {projectId || 'Details'}</h1>
            <p className="max-w-3xl text-sm text-text-default">
              A full redesign and optimization initiative focused on improving onboarding, navigation clarity, and conversion flow.
            </p>
          </div>
          <span className="rounded-full bg-primary-soft-sky/25 px-3 py-1 text-xs font-medium text-[#4C566A]">In Progress</span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-text-default">
            <span>Overall Progress</span>
            <span className="font-medium text-accent-warm-grey">{progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-background-light-sand">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-dusty-blue to-primary-soft-sky" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Project Info</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Calendar className="h-4 w-4 text-primary-dusty-blue" />
              Due Date: Dec 15, 2024
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Users className="h-4 w-4 text-primary-dusty-blue" />
              Team: Team A
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Clock className="h-4 w-4 text-primary-dusty-blue" />
              Last Updated: 3 hours ago
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Members</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Alice', 'Bob', 'Sarah', 'Mike'].map((member, idx) => (
              <span
                key={member}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-background-warm-off-white ${
                  ['bg-primary-dusty-blue', 'bg-secondary-sage-green', 'bg-accent-muted-coral', 'bg-[#88C0D0]'][idx % 4]
                }`}
              >
                {member}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#E07A5F]/35 bg-[#E07A5F]/10 px-3 py-2 text-sm font-medium text-[#4C566A] transition hover:bg-[#E07A5F]/20">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Milestones</h2>
          <ul className="mt-3 space-y-2">
            {milestones.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl bg-background-light-sand px-3 py-2">
                <span className="text-sm text-accent-warm-grey">{item.title}</span>
                {item.done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-olive-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    Done
                  </span>
                ) : (
                  <span className="text-xs font-medium text-text-default">Pending</span>
                )}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-dusty-blue" />
            <h2 className="text-lg font-semibold text-accent-warm-grey">Related Messages</h2>
          </div>
          <div className="space-y-2">
            {relatedMessages.map((message) => (
              <button
                key={message.id}
                className="w-full rounded-xl bg-background-light-sand p-3 text-left"
                onClick={() => {
                  localStorage.setItem('chatTarget', message.sender);
                  setActiveView('chat');
                }}
              >
                <p className="text-sm font-medium text-accent-warm-grey">{message.sender}</p>
                <p className="mt-0.5 text-sm text-text-default">{message.text}</p>
                <p className="mt-1 text-xs text-text-default">{message.time}</p>
              </button>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
