import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, MessageCircle, FileText, UserCheck, CalendarClock, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../api';
import { SOCKET_URL } from '../config';
import { useAuth } from '../hooks/useAuth';

const typeIcons = {
  task: UserCheck,
  mention: MessageCircle,
  project: CheckCircle,
  file: FileText,
  deadline: CalendarClock,
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

export default function Notifications() {
  const { authUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/collab/notifications');
        if (!mounted) return;
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch {
        if (!mounted) return;
        setError('Failed to load notifications');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNotifications();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const userId = String(authUser?._id || authUser?.id || '');
    if (!userId) return undefined;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      upgrade: false,
    });

    socket.on('connect', () => {
      socket.emit('join_user', userId);
    });

    socket.on('notification:new', (incoming) => {
      const incomingId = String(incoming?._id || '');
      if (!incomingId) return;
      setNotifications((prev) => {
        if (prev.some((item) => String(item._id) === incomingId)) return prev;
        return [incoming, ...prev];
      });
    });

    return () => {
      socket.emit('leave_user', userId);
      socket.disconnect();
    };
  }, [authUser]);

  const filteredNotifications = useMemo(
    () => notifications.filter((notification) => filter === 'all' || notification.type === filter),
    [filter, notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const handleMarkRead = async (notificationId) => {
    if (!notificationId) return;
    try {
      setBusy(true);
      await api.put(`/collab/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((item) => (String(item._id) === String(notificationId) ? { ...item, read: true } : item))
      );
    } catch {
      setError('Failed to update notification');
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setBusy(true);
      await api.put('/collab/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      setError('Failed to mark notifications as read');
    } finally {
      setBusy(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setBusy(true);
      await api.delete('/collab/notifications');
      setNotifications([]);
    } catch {
      setError('Failed to clear notifications');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Notifications</h1>
          <p className="text-text-default mt-1">Stay updated with team activity and task assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={busy || notifications.length === 0}
            className="px-4 py-2 rounded-xl bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20 transition-all disabled:opacity-60"
          >
            Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            disabled={busy || notifications.length === 0}
            className="px-4 py-2 bg-primary-dusty-blue text-background-warm-off-white rounded-xl hover:bg-primary-soft-sky transition-all font-medium disabled:opacity-60"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#88C0D0]/25 bg-background-warm-off-white px-4 py-3 text-sm text-text-default">
        {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'You are all caught up'}
      </div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-4 py-3 text-sm text-[#4C566A]">{error}</p>}

      <div className="flex gap-2 mb-6">
        {['all', 'task', 'mention', 'project', 'file', 'deadline'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === type
                ? 'bg-primary-dusty-blue text-background-warm-off-white shadow-md'
                : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-[#88C0D0]/25 bg-background-warm-off-white py-16">
            <Loader2 className="h-5 w-5 animate-spin text-primary-dusty-blue" />
          </div>
        )}

        {!loading &&
          filteredNotifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            return (
              <motion.div
                key={String(notification._id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative cursor-pointer p-4 rounded-2xl border transition-all ${
                  notification.read
                    ? 'border-[#88C0D0]/25 bg-background-warm-off-white hover:shadow-md'
                    : 'border-primary-soft-sky/50 bg-primary-soft-sky/10 ring-2 ring-primary-soft-sky/20 shadow-lg hover:shadow-xl'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (!notification.read) handleMarkRead(String(notification._id));
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-primary-dusty-blue to-primary-soft-sky text-background-warm-off-white shadow-md mt-0.5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-accent-warm-grey leading-tight pr-6">{notification.title}</h3>
                      <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0 ml-4">{timeAgo(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-default mb-2">{notification.message}</p>
                  </div>
                  {!notification.read && <div className="flex-shrink-0 w-2 h-2 bg-primary-dusty-blue rounded-full mt-2 animate-pulse" />}
                </div>
              </motion.div>
            );
          })}

        {!loading && filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl border-2 border-dashed border-[#88C0D0]/25 bg-background-warm-off-white"
          >
            <Bell className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-main mb-2">No notifications</h3>
            <p className="text-text-muted">You're all caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
