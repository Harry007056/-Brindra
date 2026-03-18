import React from 'react';
import { motion } from 'framer-motion';
import { LayoutList, Filter, Calendar, UserCheck } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const mockTasks = [
  { id: '1', title: 'Review Q3 Design System Update', status: 'in-progress', priority: 'high', assignee: 'Aman Verma', due: 'Oct 15' },
  { id: '2', title: 'Prepare Client Presentation Deck', status: 'completed', priority: 'medium', assignee: 'Priya Sharma', due: 'Oct 12' },
  { id: '3', title: 'API Rate Limiting Implementation', status: 'pending', priority: 'high', assignee: 'Harshal Thorat', due: 'Oct 18' },
  { id: '4', title: 'Update Project README', status: 'in-progress', priority: 'low', assignee: 'You', due: 'Oct 20' },
];

const statusColors = {
  completed: 'bg-secondary-olive-accent/10 text-secondary-olive-accent ring-secondary-olive-accent/20',
  'in-progress': 'bg-primary-soft-sky/10 text-primary-dusty-blue ring-primary-soft-sky/20',
  pending: 'bg-accent-muted-coral/10 text-accent-muted-coral ring-accent-muted-coral/20',
};

export default function Tasks() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Tasks</h1>
          <p className="text-text-default mt-1">All tasks across your projects and teams</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-text-default bg-background-light-sand px-3 py-1.5 rounded-xl">
            <Calendar className="h-3.5 w-3.5" />
            <span>12 due today</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 bg-background-warm-off-white rounded-2xl p-4 border border-[#88C0D0]/25">
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-xl bg-primary-soft-sky/20 text-primary-dusty-blue hover:bg-primary-soft-sky/40 transition-all">
          <Filter className="h-3.5 w-3.5" />
          All Tasks
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 hover:text-primary-dusty-blue transition-all">
          Pending
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 hover:text-primary-dusty-blue transition-all">
          In Progress
        </button>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 hover:text-primary-dusty-blue transition-all">
          Completed
        </button>
      </motion.div>

      {/* Tasks List */}
      <motion.div variants={fadeUp} className="space-y-3">
        {mockTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group border border-[#88C0D0]/25 rounded-2xl p-6 hover:shadow-lg hover:border-primary-soft-sky/50 transition-all bg-background-warm-off-white overflow-hidden hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${statusColors[task.status]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-accent-warm-grey text-lg leading-tight pr-4">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.priority === 'high' ? 'bg-accent-muted-coral text-accent-muted-coral/90' : 'bg-secondary-sage-green text-secondary-olive-accent'}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-text-default">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[task.status].replace('bg-', 'text-').replace('/10', '/90')}`}>
                    {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span>Assignee: {task.assignee}</span>
                  <span className="ml-auto text-primary-dusty-blue font-medium">Due {task.due}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

