import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import {
  TrendingUp,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'react-toastify';
import api from '../api';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEADLINE_ALERT_WINDOW_MS = 24 * 60 * 60 * 1000;
const DEADLINE_ALERT_STORAGE_KEY = 'brindra-deadline-alerted-task-ids';

const timeAgo = (value) => {
  if (!value) return 'just now';
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (Number.isNaN(diff) || diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const initials = (name) => {
  const text = String(name || '').trim();
  if (!text) return 'NA';
  return text
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
};

const colorByStatus = {
  Completed: 'var(--brand-soft)',
  'In Progress': 'var(--brand-primary)',
  Pending: '#A3BE8C',
};

export default function Dashboard({ userName }) {
  const { authUser } = useAuth();
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, projectsRes, tasksRes, messagesRes] = await Promise.all([
          api.get('/collab/users'),
          api.get('/collab/projects'),
          api.get('/collab/tasks'),
          api.get('/collab/messages'),
        ]);

        if (!isMounted) return;
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setMessages(Array.isArray(messagesRes.data) ? messagesRes.data : []);
      } catch {
        if (!isMounted) return;
        setError('Failed to load dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
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

    const refreshTasks = async () => {
      try {
        const response = await api.get('/collab/tasks');
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch {}
    };

    const refreshMessages = async () => {
      try {
        const response = await api.get('/collab/messages');
        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch {}
    };

    socket.on('task:created', refreshTasks);
    socket.on('task:completed', refreshTasks);
    socket.on('task:reopened', refreshTasks);
    socket.on('task:updated', refreshTasks);
    socket.on('project_message:new', refreshMessages);
    socket.on('direct_message:new', refreshMessages);

    return () => {
      socket.emit('leave_user', userId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  useEffect(() => {
    if (!tasks.length) return;

    const now = Date.now();
    const alertedTaskIds = new Set(
      JSON.parse(sessionStorage.getItem(DEADLINE_ALERT_STORAGE_KEY) || '[]')
    );

    const nearDueTaskIds = [];
    const overdueTaskIds = [];

    tasks.forEach((task) => {
      if (task.completed || !task.dueDate) return;
      const dueAt = new Date(task.dueDate).getTime();
      if (Number.isNaN(dueAt)) return;
      const taskId = String(task._id || '');
      if (!taskId || alertedTaskIds.has(taskId)) return;

      const diff = dueAt - now;
      if (diff >= 0 && diff <= DEADLINE_ALERT_WINDOW_MS) {
        nearDueTaskIds.push(taskId);
      } else if (diff < 0) {
        overdueTaskIds.push(taskId);
      }
    });

    if (overdueTaskIds.length > 0) {
      toast.error(`Alert: ${overdueTaskIds.length} task(s) are overdue.`);
      overdueTaskIds.forEach((id) => alertedTaskIds.add(id));
    }

    if (nearDueTaskIds.length > 0) {
      toast.warn(`Alert: ${nearDueTaskIds.length} task(s) are due within 24 hours.`);
      nearDueTaskIds.forEach((id) => alertedTaskIds.add(id));
    }

    sessionStorage.setItem(DEADLINE_ALERT_STORAGE_KEY, JSON.stringify([...alertedTaskIds]));
  }, [tasks]);

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

  const projectStatus = useMemo(() => {
    const counters = {
      Completed: 0,
      'In Progress': 0,
      Pending: 0,
    };

    projects.forEach((project) => {
      const projectTasks = tasksByProject[String(project._id)] || [];
      if (projectTasks.length === 0) {
        counters.Pending += 1;
        return;
      }

      const done = projectTasks.filter((task) => task.completed).length;
      if (done === 0) counters.Pending += 1;
      else if (done === projectTasks.length) counters.Completed += 1;
      else counters['In Progress'] += 1;
    });

    return Object.entries(counters).map(([name, value]) => ({
      name,
      value,
      color: colorByStatus[name],
    }));
  }, [projects, tasksByProject]);

  const activityData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      days.push({
        key: date.toISOString().slice(0, 10),
        name: DAY_LABELS[date.getDay()],
        tasks: 0,
        messages: 0,
      });
    }

    const indexByKey = days.reduce((acc, day, idx) => {
      acc[day.key] = idx;
      return acc;
    }, {});

    tasks.forEach((task) => {
      const key = new Date(task.createdAt || task.updatedAt || Date.now()).toISOString().slice(0, 10);
      const idx = indexByKey[key];
      if (idx !== undefined) days[idx].tasks += 1;
    });

    messages.forEach((message) => {
      const key = new Date(message.createdAt || Date.now()).toISOString().slice(0, 10);
      const idx = indexByKey[key];
      if (idx !== undefined) days[idx].messages += 1;
    });

    return days;
  }, [tasks, messages]);

  const recentActivity = useMemo(() => {
    return messages.slice(0, 6).map((message) => {
      const sender = userById[String(message.senderId)]?.name || 'Unknown User';
      const project = projects.find((item) => String(item._id) === String(message.projectId));
      return {
        user: sender,
        action: 'posted in',
        target: project?.name || 'General',
        time: timeAgo(message.createdAt),
        avatar: initials(sender),
      };
    });
  }, [messages, projects, userById]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map((task) => {
        const project = projects.find((item) => String(item._id) === String(task.projectId));
        return {
          id: String(task._id),
          title: task.title,
          date: new Date(task.dueDate).toLocaleString(),
          project: project?.name || 'Unknown Project',
        };
      });
  }, [projects, tasks]);

  const stats = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status === 'active').length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const openTasks = tasks.length - completedTasks;

    return [
      { label: 'Active Projects', value: String(activeProjects), change: `${projects.length} total`, icon: FolderKanban, color: 'from-primary-dusty-blue to-primary-soft-sky' },
      { label: 'Team Members', value: String(users.length), change: `${users.filter((u) => u.isActive !== false).length} active`, icon: Users, color: 'from-[#A3BE8C] to-[#6B8E23]' },
      { label: 'Tasks Done', value: String(completedTasks), change: `${tasks.length} total`, icon: CheckCircle2, color: 'from-[#E07A5F] to-[#E07A5F]' },
      { label: 'Open Tasks', value: String(openTasks), change: `${messages.length} messages`, icon: Clock, color: 'from-[#5E81AC] to-[#88C0D0]' },
    ];
  }, [projects, users, tasks, messages]);

  const displayName = String(userName || '').trim() || 'there';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Welcome back, {displayName}</h1>
        <p className="text-text-default">Here&apos;s what&apos;s happening with your team today.</p>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`} />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-default">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-accent-warm-grey">{stat.value}</p>
                </div>
                <div className="rounded-xl bg-background-light-sand p-2 text-primary-dusty-blue">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 font-medium text-secondary-olive-accent">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Team Activity</h2>
            <div className="flex items-center gap-4 text-xs text-text-default">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-dusty-blue" />
                Tasks
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary-sage-green" />
                Messages
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-soft)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--brand-soft)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3BE8C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A3BE8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0DDD4" />
                <XAxis dataKey="name" stroke="#8B8E7E" fontSize={12} />
                <YAxis stroke="#8B8E7E" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F9F6',
                    border: '1px solid #E0DDD4',
                    borderRadius: '12px',
                    color: '#4C566A',
                  }}
                />
                <Area type="monotone" dataKey="tasks" stroke="var(--brand-primary)" strokeWidth={2} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="messages" stroke="#A3BE8C" strokeWidth={2} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Project Status</h2>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <PieChart>
                <Pie
                  data={projectStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F8F9F6',
                    border: '1px solid #E0DDD4',
                    borderRadius: '12px',
                    color: '#4C566A',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {projectStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-background-light-sand px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-accent-warm-grey">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-accent-warm-grey">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Recent Activity</h2>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary-dusty-blue hover:text-primary-soft-sky" type="button">
              Latest <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 && <p className="text-sm text-text-default">No activity yet.</p>}
            {recentActivity.map((activity, index) => (
              <motion.div
                key={`${activity.user}-${activity.time}-${index}`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 rounded-xl bg-background-light-sand p-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-dusty-blue text-sm font-semibold text-background-warm-off-white">
                  {activity.avatar}
                </div>
                <div>
                  <p className="text-sm text-accent-warm-grey">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-text-default">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-text-default">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Upcoming Deadlines</h2>
            <Calendar className="h-5 w-5 text-primary-dusty-blue" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 && <p className="text-sm text-text-default">No due dates available.</p>}
            {upcomingDeadlines.map((deadline, index) => (
              <motion.div
                key={deadline.id}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between rounded-xl bg-background-light-sand p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-1.5 rounded-full bg-primary-dusty-blue" />
                  <div>
                    <h3 className="text-sm font-semibold text-accent-warm-grey">{deadline.title}</h3>
                    <p className="text-xs text-text-default">
                      {deadline.date} • {deadline.project}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {loading && <p className="text-sm text-text-default">Loading dashboard...</p>}
    </div>
  );
}


