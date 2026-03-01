import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { clsx } from 'clsx';

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    progress: 75,
    status: 'in-progress',
    dueDate: 'Dec 15, 2024',
    team: ['SC', 'MR', 'ED'],
    tasks: { total: 24, completed: 18 },
    color: 'from-primary-dusty-blue to-primary-soft-sky',
  },
  {
    id: 2,
    name: 'Mobile App v2.0',
    description: 'Next generation mobile application with new features',
    progress: 45,
    status: 'in-progress',
    dueDate: 'Jan 20, 2025',
    team: ['JL', 'AG', 'DP'],
    tasks: { total: 32, completed: 14 },
    color: 'from-[#A3BE8C] to-[#6B8E23]',
  },
  {
    id: 3,
    name: 'API Integration',
    description: 'Third-party API integrations for data synchronization',
    progress: 90,
    status: 'review',
    dueDate: 'Dec 5, 2024',
    team: ['MR', 'JL'],
    tasks: { total: 12, completed: 11 },
    color: 'from-[#E07A5F] to-[#E07A5F]',
  },
  {
    id: 4,
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    progress: 100,
    status: 'completed',
    dueDate: 'Nov 30, 2024',
    team: ['ED', 'SC'],
    tasks: { total: 20, completed: 20 },
    color: 'from-[#5E81AC] to-[#88C0D0]',
  },
];

const filters = ['All', 'In Progress', 'Review', 'Completed', 'On Hold'];

const statusClasses = {
  'in-progress': 'bg-primary-soft-sky/25 text-[#4C566A]',
  review: 'bg-accent-muted-coral/20 text-[#4C566A]',
  completed: 'bg-secondary-sage-green/25 text-[#6B8E23]',
  'on-hold': 'bg-slate-200 text-slate-600',
};

const avatarPalette = ['bg-primary-dusty-blue', 'bg-secondary-sage-green', 'bg-accent-muted-coral', 'bg-[#88C0D0]'];

export default function Projects({ setActiveView }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const normalizedFilter = activeFilter.toLowerCase().replace(/\s+/g, '-');
  const visibleProjects =
    normalizedFilter === 'all' ? projects : projects.filter((project) => project.status === normalizedFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-warm-grey">Projects</h1>
          <p className="text-text-default">Track and manage your team's projects.</p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={clsx(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                    isActive
                      ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                      : 'border-[#88C0D0]/30 bg-background-warm-off-white text-primary-dusty-blue hover:bg-background-light-sand'
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="flex w-full gap-2 lg:w-auto">
            <div className="relative flex-1 lg:min-w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 text-sm text-primary-dusty-blue transition hover:bg-background-light-sand">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
          >
            <div className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', project.color)} />

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-accent-warm-grey">{project.name}</h3>
                <p className="mt-1 text-sm text-text-default">{project.description}</p>
              </div>
              <button className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-text-default">
                <span>Progress</span>
                <span className="font-medium text-accent-warm-grey">{project.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background-light-sand">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.7 }}
                  className={clsx('h-full rounded-full bg-gradient-to-r', project.color)}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-background-light-sand p-3">
              <div className="flex items-center gap-2 text-sm text-text-default">
                <Calendar className="h-4 w-4 text-primary-dusty-blue" />
                <span>Due {project.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-default">
                {project.progress === 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-secondary-olive-accent" />
                ) : (
                  <Clock className="h-4 w-4 text-primary-dusty-blue" />
                )}
                <span>
                  {project.tasks.completed}/{project.tasks.total} tasks completed
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.map((member, i) => (
                  <div
                    key={member}
                    className={clsx(
                      'grid h-8 w-8 place-items-center rounded-full border-2 border-background-warm-off-white text-[10px] font-semibold text-background-warm-off-white',
                      avatarPalette[i % avatarPalette.length]
                    )}
                  >
                    {member}
                  </div>
                ))}
              </div>

              <span
                className={clsx(
                  'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  statusClasses[project.status] || 'bg-slate-100 text-slate-600'
                )}
              >
                {project.status.replace('-', ' ')}
              </span>
            </div>

            <button
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-dusty-blue transition hover:text-primary-soft-sky"
              onClick={() => {
                localStorage.setItem('selectedProject', project.id);
                setActiveView('project-details');
              }}
            >
              Open <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
