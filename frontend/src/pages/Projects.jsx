import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight
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
    color: 'from-[#5b8def] to-[#3d7bd4]'
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
    color: 'from-[#A3BE8C] to-[#6B8E23]'
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
    color: 'from-[#E07A5F] to-[#D4694F]'
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
    color: 'from-[#3d7bd4] to-[#5b8def]'
  },
];

const filters = ['All', 'In Progress', 'Review', 'Completed', 'On Hold'];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#4C566A] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}> 
            Projects
          </h1>
          <p className="text-[#8B8E7E]">Track and manage your team's projects.</p>
        </div>
        
        <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#5b8def] to-[#3d7bd4] text-[#4C566A] font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeFilter === filter
                  ? 'bg-[#5b8def] text-[#4C566A]'
                  : 'bg-[#F8F9F6] text-[#8B8E7E] hover:text-[#4C566A] border border-[#E0DDD4]/50'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 sm:max-w-xs ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8E7E]" />
          <input 
            type="text"
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-2 rounded-xl bg-[#F8F9F6] border border-[#E0DDD4]/50 text-[#4C566A] placeholder-[#a8a29e] focus:outline-none focus:border-[#5b8def] transition-colors"
          />
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 hover:border-[#5b8def]/30 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-sm bg-gradient-to-br ${project.color}`} />
                <h3 className="text-[#4C566A] font-semibold text-lg group-hover:text-[#5b8def] transition-colors">
                  {project.name}
                </h3>
              </div>
              <button className="p-2 rounded-lg hover:bg-[#F1F3EE]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#8B8E7E] text-sm mb-4">{project.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#8B8E7E]">Progress</span>
                <span className="text-[#4C566A] font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#E0DDD4]/50 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
                />
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-[#8B8E7E] text-sm">
                <Calendar className="w-4 h-4" />
                {project.dueDate}
              </div>
              <div className="flex items-center gap-2 text-[#8B8E7E] text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {project.tasks.completed}/{project.tasks.total} tasks
              </div>
            </div>

            {/* Team & Status */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E0DDD4]/50">
              <div className="flex -space-x-2">
                {project.team.map((member, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5b8def] to-[#3d7bd4] flex items-center justify-center text-[#4C566A] text-xs font-semibold border-2 border-[#F8F9F6]"
                  >
                    {member}
                  </div>
                ))}
              </div>
              <span className={clsx(
                'px-3 py-1 rounded-lg text-xs font-medium',
                project.status === 'completed' ? 'bg-[#A3BE8C]/20 text-[#A3BE8C]' :
                project.status === 'review' ? 'bg-[#3d7bd4]/20 text-[#3d7bd4]' :
                'bg-[#5b8def]/20 text-[#5b8def]'
              )}>
                {project.status.replace('-', ' ')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
