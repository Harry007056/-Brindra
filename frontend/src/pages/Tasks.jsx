import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutList, Filter, Calendar, UserCheck, CheckCircle2, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../api';
import { SOCKET_URL } from '../config';
import { useAuth } from '../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const statusColors = {
  completed: 'bg-secondary-olive-accent/10 text-secondary-olive-accent ring-secondary-olive-accent/20',
  'in-progress': 'bg-primary-soft-sky/10 text-primary-dusty-blue ring-primary-soft-sky/20',
  pending: 'bg-accent-muted-coral/10 text-accent-muted-coral ring-accent-muted-coral/20',
};

const priorityColors = {
  high: 'bg-accent-muted-coral text-accent-muted-coral/90',
  medium: 'bg-secondary-sage-green text-secondary-olive-accent',
  low: 'bg-primary-soft-sky text-primary-dusty-blue',
};

const formatDueDate = (dueDate) => {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const timeAgo = (value) => {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Tasks() {
  const { authUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const socketRef = useRef(null);
  const authUserIdRef = useRef('');

  useEffect(() => {
    authUserIdRef.current = String(authUser?.id || authUser?._id || '');
  }, [authUser]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [tasksRes, projectsRes, usersRes] = await Promise.all([
          api.get('/collab/tasks'),
          api.get('/collab/projects'),
          api.get('/collab/users'),
        ]);

        if (!mounted) return;

        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch {
        if (!mounted) return;
        setError('Failed to load tasks');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const userId = String(authUser?.id || authUser?._id || '');
    if (!userId) return undefined;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      upgrade: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_user', userId);
    });

    // Listen for real-time task updates
    socket.on('task:created', (data) => {
      if (!data?.task) return;
      setTasks((prev) => [data.task, ...prev]);
    });

    socket.on('task:updated', (data) => {
      if (!data?.task) return;
      setTasks((prev) =>
        prev.map((task) =>
          String(task._id) === String(data.task._id) ? data.task : task
        )
      );
    });

    socket.on('task:completed', (data) => {
      if (!data?.task) return;
      setTasks((prev) =>
        prev.map((task) =>
          String(task._id) === String(data.task._id) ? data.task : task
        )
      );
    });

    socket.on('task:reopened', (data) => {
      if (!data?.task) return;
      setTasks((prev) =>
        prev.map((task) =>
          String(task._id) === String(data.task._id) ? data.task : task
        )
      );
    });

    return () => {
      socket.emit('leave_user', userId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  const userById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[String(user._id)] = user;
      return acc;
    }, {});
  }, [users]);

  const projectById = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[String(project._id)] = project;
      return acc;
    }, {});
  }, [projects]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      if (filter === 'overdue') return isOverdue(task.dueDate) && !task.completed;
      return true;
    });
  }, [tasks, filter]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((task) => isOverdue(task.dueDate) && !task.completed).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  const handleToggleComplete = async (taskId) => {
    setUpdating(taskId);
    try {
      const response = await api.put(`/collab/tasks/${taskId}`, {
        completed: !tasks.find((t) => String(t._id) === taskId)?.completed,
      });

      setTasks((prev) =>
        prev.map((task) =>
          String(task._id) === taskId ? response.data : task
        )
      );
    } catch {
      setError('Failed to update task');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-dusty-blue" />
      </div>
    );
  }

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
            <span>{taskStats.overdue} overdue</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-default bg-background-light-sand px-3 py-1.5 rounded-xl">
            <Clock className="h-3.5 w-3.5" />
            <span>{taskStats.pending} pending</span>
          </div>
        </div>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 bg-background-warm-off-white rounded-2xl p-4 border border-[#88C0D0]/25">
        <button
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-primary-soft-sky/20 text-primary-dusty-blue'
              : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 hover:text-primary-dusty-blue'
          }`}
          onClick={() => setFilter('all')}
        >
          <Filter className="h-3.5 w-3.5" />
          All Tasks ({taskStats.total})
        </button>
        <button
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl transition-all ${
            filter === 'pending'
              ? 'bg-accent-muted-coral/20 text-accent-muted-coral'
              : 'bg-background-light-sand text-text-default hover:bg-accent-muted-coral/20 hover:text-accent-muted-coral'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending ({taskStats.pending})
        </button>
        <button
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl transition-all ${
            filter === 'completed'
              ? 'bg-secondary-olive-accent/20 text-secondary-olive-accent'
              : 'bg-background-light-sand text-text-default hover:bg-secondary-olive-accent/20 hover:text-secondary-olive-accent'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed ({taskStats.completed})
        </button>
        <button
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl transition-all ${
            filter === 'overdue'
              ? 'bg-red-500/20 text-red-600'
              : 'bg-background-light-sand text-text-default hover:bg-red-500/20 hover:text-red-600'
          }`}
          onClick={() => setFilter('overdue')}
        >
          Overdue ({taskStats.overdue})
        </button>
      </motion.div>

      {/* Tasks List */}
      <motion.div variants={fadeUp} className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <LayoutList className="h-12 w-12 text-text-default mx-auto mb-4" />
            <p className="text-text-default">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const assignee = userById[String(task.assigneeId)];
            const project = projectById[String(task.projectId)];
            const overdue = isOverdue(task.dueDate) && !task.completed;

            return (
              <motion.div
                key={String(task._id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group border border-[#88C0D0]/25 rounded-2xl p-6 hover:shadow-lg hover:border-primary-soft-sky/50 transition-all bg-background-warm-off-white overflow-hidden hover:-translate-y-1 ${
                  overdue ? 'ring-2 ring-red-500/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(String(task._id))}
                    disabled={updating === String(task._id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {updating === String(task._id) ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary-dusty-blue" />
                    ) : task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-secondary-olive-accent" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-primary-dusty-blue hover:bg-primary-dusty-blue/10 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-semibold text-accent-warm-grey text-lg leading-tight pr-4 ${
                        task.completed ? 'line-through text-text-default' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {overdue && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-600">
                            OVERDUE
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.completed ? 'bg-secondary-olive-accent/20 text-secondary-olive-accent' : 'bg-primary-soft-sky/20 text-primary-dusty-blue'
                        }`}>
                          {task.completed ? 'COMPLETED' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-text-default">
                      {assignee && (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5" />
                          {assignee.name}
                        </span>
                      )}
                      {project && (
                        <span>Project: {project.name}</span>
                      )}
                      {task.dueDate && (
                        <span className={`ml-auto font-medium ${overdue ? 'text-red-600' : 'text-primary-dusty-blue'}`}>
                          Due {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                      <span>Created {timeAgo(task.createdAt)}</span>
                      {task.updatedAt && task.updatedAt !== task.createdAt && (
                        <span>Updated {timeAgo(task.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}

