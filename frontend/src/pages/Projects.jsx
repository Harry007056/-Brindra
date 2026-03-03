import { useEffect, useMemo, useState } from 'react';
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
import { toast } from 'react-toastify';
import api from '../api';

const filters = ['All', 'In Progress', 'Review', 'Completed', 'On Hold'];

const statusClasses = {
  'in-progress': 'bg-primary-soft-sky/25 text-[#4C566A]',
  review: 'bg-accent-muted-coral/20 text-[#4C566A]',
  completed: 'bg-secondary-sage-green/25 text-[#6B8E23]',
  'on-hold': 'bg-slate-200 text-slate-600',
};

const avatarPalette = ['bg-primary-dusty-blue', 'bg-secondary-sage-green', 'bg-accent-muted-coral', 'bg-[#88C0D0]'];

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NA';

const calcProjectStatus = (project, projectTasks) => {
  if (project.status === 'archived') return 'on-hold';
  if (!projectTasks.length) return 'review';
  const done = projectTasks.filter((task) => task.completed).length;
  if (done === projectTasks.length) return 'completed';
  if (done > 0) return 'in-progress';
  return 'review';
};

const getDueDate = (projectTasks) => {
  const datedTasks = projectTasks.filter((task) => task.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  if (!datedTasks.length) return 'No due date';
  return new Date(datedTasks[0].dueDate).toLocaleDateString();
};

export default function Projects({ setActiveView, authUser }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          api.get('/collab/projects'),
          api.get('/collab/tasks'),
          api.get('/collab/users'),
        ]);

        if (!isMounted) return;
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch {
        if (!isMounted) return;
        setError('Failed to load projects');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const userById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[String(user._id)] = user;
      return acc;
    }, {});
  }, [users]);

  const tasksByProject = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = String(task.projectId || '');
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const mappedProjects = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasksByProject[String(project._id)] || [];
      const completed = projectTasks.filter((task) => task.completed).length;
      const total = projectTasks.length;
      const progress = total ? Math.round((completed / total) * 100) : 0;
      const status = calcProjectStatus(project, projectTasks);

      const assigneeIds = [...new Set(projectTasks.map((task) => String(task.assigneeId || '')).filter(Boolean))];
      const team = assigneeIds
        .map((id) => userById[id]?.name)
        .filter(Boolean)
        .slice(0, 3)
        .map(initials);

      if (!team.length && project.ownerId) {
        team.push(initials(userById[String(project.ownerId)]?.name || 'Owner'));
      }

      return {
        id: String(project._id),
        name: project.name,
        description: project.description || 'No description',
        progress,
        status,
        dueDate: getDueDate(projectTasks),
        team,
        tasks: { total, completed },
        color:
          status === 'completed'
            ? 'from-[#5E81AC] to-[#88C0D0]'
            : status === 'on-hold'
              ? 'from-[#A3BE8C] to-[#6B8E23]'
              : status === 'review'
                ? 'from-[#E07A5F] to-[#E07A5F]'
                : 'from-primary-dusty-blue to-primary-soft-sky',
      };
    });
  }, [projects, tasksByProject, userById]);

  const normalizedFilter = activeFilter.toLowerCase().replace(/\s+/g, '-');
  const visibleProjects = mappedProjects.filter((project) => {
    const matchesFilter = normalizedFilter === 'all' ? true : project.status === normalizedFilter;
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateProject = async () => {
    const name = window.prompt('Enter project name');
    if (!name || !name.trim()) return;
    const description = window.prompt('Enter project description (optional)') || '';

    try {
      const response = await api.post('/collab/projects', {
        name: name.trim(),
        description: description.trim(),
        status: 'active',
        ownerId: authUser?.id || null,
      });

      const created = response.data;
      if (created?._id) {
        setProjects((prev) => [created, ...prev]);
      } else {
        const refresh = await api.get('/collab/projects');
        setProjects(Array.isArray(refresh.data) ? refresh.data : []);
      }
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create project');
    }
  };

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
          <p className="text-text-default">Track and manage your team&apos;s projects.</p>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
          type="button"
          onClick={handleCreateProject}
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

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
                  type="button"
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 text-sm text-primary-dusty-blue transition hover:bg-background-light-sand" type="button">
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
              <button className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey" type="button">
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
                    key={`${member}-${i}`}
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
              type="button"
            >
              Open <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {!loading && visibleProjects.length === 0 && <p className="text-sm text-text-default">No projects found.</p>}
      {loading && <p className="text-sm text-text-default">Loading projects...</p>}
    </div>
  );
}
