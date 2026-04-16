import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Users, TrendingUp, CalendarDays, Loader2, TrendingDown, Minus } from 'lucide-react';
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
  show: { transition: { staggerChildren: 0.1 } },
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
  if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
};

const timeAgo = (value) => {
  if (!value) return 'just now';
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Analytics() {
  const { authUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const socketRef = useRef(null);
  const authUserIdRef = useRef('');

  useEffect(() => {
    authUserIdRef.current = String(authUser?.id || authUser?._id || '');
  }, [authUser]);

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/collab/analytics');
        if (!mounted) return;
        setAnalytics(response.data);
      } catch {
        if (!mounted) return;
        setError('Failed to load analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAnalytics();

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

    // Listen for real-time updates that affect analytics
    socket.on('task:created', () => {
      // Refresh analytics when tasks are created
      api.get('/collab/analytics').then((response) => {
        setAnalytics(response.data);
      }).catch(() => {});
    });

    socket.on('task:completed', () => {
      // Refresh analytics when tasks are completed
      api.get('/collab/analytics').then((response) => {
        setAnalytics(response.data);
      }).catch(() => {});
    });

    socket.on('task:updated', () => {
      // Refresh analytics when tasks are updated
      api.get('/collab/analytics').then((response) => {
        setAnalytics(response.data);
      }).catch(() => {});
    });

    socket.on('notification:new', (notification) => {
      // Refresh analytics when we get task/project related notifications
      if (['task', 'project'].includes(notification.type)) {
        api.get('/collab/analytics').then((response) => {
          setAnalytics(response.data);
        }).catch(() => {});
      }
    });

    socket.on('project_message:new', () => {
      // Refresh analytics when new messages are posted (affects activity)
      api.get('/collab/analytics').then((response) => {
        setAnalytics(response.data);
      }).catch(() => {});
    });

    socket.on('direct_message:new', () => {
      // Refresh analytics when new direct messages are posted
      api.get('/collab/analytics').then((response) => {
        setAnalytics(response.data);
      }).catch(() => {});
    });

    return () => {
      socket.emit('leave_user', userId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  const metrics = useMemo(() => {
    if (!analytics?.metrics) return [];

    return [
      {
        label: 'Active Projects',
        value: analytics.metrics.activeProjects.value,
        change: analytics.metrics.activeProjects.change,
        trend: analytics.metrics.activeProjects.trend,
        color: 'from-[#5E81AC] to-[#88C0D0]',
        icon: TrendingUp
      },
      {
        label: 'Team Members',
        value: analytics.metrics.teamMembers.value,
        change: analytics.metrics.teamMembers.change,
        trend: analytics.metrics.teamMembers.trend,
        color: 'from-[#A3BE8C] to-[#6B8E23]',
        icon: Users
      },
      {
        label: 'Tasks Completed',
        value: analytics.metrics.tasksCompleted.value,
        change: analytics.metrics.tasksCompleted.change,
        trend: analytics.metrics.tasksCompleted.trend,
        color: 'from-[#BF616A] to-[#D08770]',
        icon: Activity
      },
      {
        label: 'Completion Rate',
        value: analytics.metrics.completionRate.value,
        change: analytics.metrics.completionRate.change,
        trend: analytics.metrics.completionRate.trend,
        color: 'from-[#8FBCBB] to-[#88C0D0]',
        icon: BarChart3
      },
    ];
  }, [analytics]);

  const recentActivity = useMemo(() => {
    if (!analytics?.recentActivity) return [];

    return analytics.recentActivity.map((item, index) => ({
      time: timeAgo(item.time),
      action: item.action,
      details: item.details,
      index
    }));
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-dusty-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="p-6 space-y-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Analytics</h1>
          <p className="text-text-default mt-1">Team performance and project insights</p>
        </div>
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-dusty-blue text-background-warm-off-white rounded-xl font-medium hover:bg-primary-soft-sky shadow-lg hover:shadow-xl transition-all"
        >
          <CalendarDays className="h-4 w-4" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background-warm-off-white rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm hover:shadow-lg hover:border-primary-soft-sky/50 transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative flex items-start justify-between">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm group-hover:bg-primary-soft-sky/20 transition-all">
                  <Icon className="h-6 w-6 text-primary-dusty-blue opacity-80 group-hover:text-background-warm-off-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-secondary-olive-accent' :
                  metric.trend === 'down' ? 'text-accent-muted-coral' : 'text-text-default'
                }`}>
                  <TrendIcon trend={metric.trend} />
                  {metric.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-accent-warm-grey [text-shadow:0_1px_0_rgb(0_0_0_0.1)]">{metric.value}</p>
                <p className="mt-1 text-sm text-text-default font-medium">{metric.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.section variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-warm-off-white rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-accent-warm-grey mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-text-default">No recent activity</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-background-light-sand transition-colors group">
                  <div className="w-2 h-2 bg-primary-dusty-blue rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main group-hover:text-primary-dusty-blue">{item.action}</p>
                    <p className="text-xs text-text-default mt-1 truncate">{item.details}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted whitespace-nowrap flex-shrink-0">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-background-warm-off-white rounded-2xl border border-[#88C0D0]/25 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-accent-warm-grey mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Overview
          </h3>
          <div className="space-y-4">
            {analytics?.projectStats?.length === 0 ? (
              <p className="text-sm text-text-default">No projects found</p>
            ) : (
              analytics?.projectStats?.slice(0, 5).map((project) => (
                <div key={String(project.id)} className="flex items-center justify-between p-3 rounded-xl hover:bg-background-light-sand transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-accent-warm-grey truncate">{project.name}</p>
                    <p className="text-xs text-text-default">
                      {project.completedTasks}/{project.taskCount} tasks • {project.activeMembers} members
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'active' ? 'bg-secondary-olive-accent/20 text-secondary-olive-accent' :
                    project.status === 'completed' ? 'bg-primary-soft-sky/20 text-primary-dusty-blue' :
                    'bg-accent-muted-coral/20 text-accent-muted-coral'
                  }`}>
                    {project.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

