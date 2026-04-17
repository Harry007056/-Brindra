import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Archive,
  ArchiveRestore,
  Bell,
  Check,
  CheckCircle,
  FileText,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Square,
  SquareCheckBig,
  Trash2,
  UserCheck,
  CalendarClock,
} from 'lucide-react';
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

const FILTERS = ['all', 'task', 'mention', 'project', 'file', 'deadline'];
const ARCHIVE_FILTERS = [
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
  { id: 'all', label: 'All' },
];

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

const defaultCounts = () =>
  FILTERS.filter((item) => item !== 'all').reduce((acc, item) => {
    acc[item] = { total: 0, unread: 0 };
    return acc;
  }, {});

const matchesFilter = (notification, filter, unreadOnly, archiveView) => {
  if (filter !== 'all' && notification?.type !== filter) return false;
  if (unreadOnly && notification?.read) return false;
  if (archiveView === 'active' && notification?.archivedAt) return false;
  if (archiveView === 'archived' && !notification?.archivedAt) return false;
  return true;
};

function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-2xl border border-[#88C0D0]/25 bg-background-warm-off-white p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-background-light-sand" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-background-light-sand" />
              <div className="h-3 w-full animate-pulse rounded bg-background-light-sand" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-background-light-sand" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [archiveView, setArchiveView] = useState('active');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [counts, setCounts] = useState(defaultCounts());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markAllBusy, setMarkAllBusy] = useState(false);
  const [clearBusy, setClearBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState('');
  const [itemBusy, setItemBusy] = useState({});
  const [error, setError] = useState('');

  const setBusyFor = (notificationId, action, value) => {
    setItemBusy((prev) => {
      const next = { ...prev };
      const key = `${notificationId}:${action}`;
      if (value) next[key] = true;
      else delete next[key];
      return next;
    });
  };

  const hydrateCounts = (payloadCounts) => {
    setCounts({
      ...defaultCounts(),
      ...(payloadCounts || {}),
    });
  };

  const loadNotifications = async ({ cursor = null, replace = false } = {}) => {
    const isInitial = replace || !cursor;

    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    if (replace) {
      setNotifications([]);
      setSelectedIds([]);
    }
    setError('');

    try {
      const params = {
        limit: 12,
        archived: archiveView,
      };
      if (cursor) params.cursor = cursor;
      if (filter !== 'all') params.type = filter;
      if (unreadOnly) params.read = 'false';

      const response = await api.get('/collab/notifications', { params });
      const payload = response.data || {};
      const incoming = Array.isArray(payload.items) ? payload.items : [];

      setNotifications((prev) => {
        const base = replace ? [] : prev;
        const byId = new Map(base.map((item) => [String(item._id), item]));
        incoming.forEach((item) => {
          byId.set(String(item._id), item);
        });
        return [...byId.values()];
      });
      setNextCursor(payload.nextCursor || null);
      setUnreadCount(Number(payload.unreadCount) || 0);
      hydrateCounts(payload.counts);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadNotifications({ replace: true });
  }, [filter, archiveView, unreadOnly]);

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
      if (!incomingId || !matchesFilter(incoming, filter, unreadOnly, archiveView)) return;

      setNotifications((prev) => {
        if (prev.some((item) => String(item._id) === incomingId)) return prev;
        return [incoming, ...prev];
      });
    });

    socket.on('notification:updated', (incoming) => {
      const incomingId = String(incoming?._id || '');
      if (!incomingId) return;

      setNotifications((prev) => {
        const existing = prev.find((item) => String(item._id) === incomingId);
        if (!existing && matchesFilter(incoming, filter, unreadOnly, archiveView)) {
          return [incoming, ...prev];
        }

        return prev
          .map((item) => (String(item._id) === incomingId ? { ...item, ...incoming } : item))
          .filter((item) => matchesFilter(item, filter, unreadOnly, archiveView));
      });
    });

    socket.on('notification:deleted', (payload) => {
      const removedId = String(payload?._id || '');
      if (!removedId) return;
      setNotifications((prev) => prev.filter((item) => String(item._id) !== removedId));
      setSelectedIds((prev) => prev.filter((item) => item !== removedId));
    });

    socket.on('notification:read_all', () => {
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() })));
    });

    socket.on('notification:cleared', () => {
      setNotifications([]);
      setSelectedIds([]);
      setNextCursor(null);
    });

    socket.on('notification:counts', (nextCounts) => {
      setUnreadCount(Number(nextCounts?.unreadCount) || 0);
      hydrateCounts(nextCounts?.byType);
    });

    return () => {
      socket.emit('leave_user', userId);
      socket.disconnect();
    };
  }, [authUser, filter, unreadOnly, archiveView]);

  const visibleNotifications = useMemo(() => notifications, [notifications]);
  const visibleIds = useMemo(() => visibleNotifications.map((item) => String(item._id)), [visibleNotifications]);
  const canLoadMore = useMemo(() => Boolean(nextCursor), [nextCursor]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelected = (notificationId) => {
    setSelectedIds((prev) =>
      prev.includes(notificationId) ? prev.filter((item) => item !== notificationId) : [...prev, notificationId]
    );
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      return [...new Set([...prev, ...visibleIds])];
    });
  };

  const handleMarkRead = async (notificationId) => {
    if (!notificationId) return;
    setBusyFor(notificationId, 'read', true);

    try {
      const response = await api.put(`/collab/notifications/${notificationId}/read`);
      const updated = response.data || {};
      setNotifications((prev) =>
        prev.map((item) => (String(item._id) === String(notificationId) ? { ...item, ...updated } : item))
      );
    } catch {
      setError('Failed to update notification');
    } finally {
      setBusyFor(notificationId, 'read', false);
    }
  };

  const handleMarkUnread = async (notificationId) => {
    if (!notificationId) return;
    setBusyFor(notificationId, 'unread', true);

    try {
      const response = await api.put(`/collab/notifications/${notificationId}/unread`);
      const updated = response.data || {};
      setNotifications((prev) =>
        prev.map((item) => (String(item._id) === String(notificationId) ? { ...item, ...updated } : item))
      );
    } catch {
      setError('Failed to update notification');
    } finally {
      setBusyFor(notificationId, 'unread', false);
    }
  };

  const handleArchive = async (notificationId, archived) => {
    if (!notificationId) return;
    setBusyFor(notificationId, archived ? 'archive' : 'unarchive', true);

    try {
      const response = await api.patch(`/collab/notifications/${notificationId}/archive`, { archived });
      const updated = response.data || {};
      setNotifications((prev) =>
        prev
          .map((item) => (String(item._id) === String(notificationId) ? { ...item, ...updated } : item))
          .filter((item) => matchesFilter(item, filter, unreadOnly, archiveView))
      );
    } catch {
      setError('Failed to update notification');
    } finally {
      setBusyFor(notificationId, archived ? 'archive' : 'unarchive', false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!notificationId) return;
    setBusyFor(notificationId, 'delete', true);

    try {
      await api.delete(`/collab/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((item) => String(item._id) !== String(notificationId)));
      setSelectedIds((prev) => prev.filter((item) => item !== String(notificationId)));
    } catch {
      setError('Failed to delete notification');
    } finally {
      setBusyFor(notificationId, 'delete', false);
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedIds.length) return;
    setBulkBusy(action);

    try {
      await api.patch('/collab/notifications/bulk', {
        action,
        notificationIds: selectedIds,
      });

      if (action === 'delete') {
        setNotifications((prev) => prev.filter((item) => !selectedIds.includes(String(item._id))));
      } else {
        await loadNotifications({ replace: true });
      }
      setSelectedIds([]);
    } catch {
      setError('Failed to apply bulk action');
    } finally {
      setBulkBusy('');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkAllBusy(true);
      await api.put('/collab/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() })));
    } catch {
      setError('Failed to mark notifications as read');
    } finally {
      setMarkAllBusy(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setClearBusy(true);
      await api.delete('/collab/notifications');
      setNotifications([]);
      setSelectedIds([]);
      setNextCursor(null);
    } catch {
      setError('Failed to clear notifications');
    } finally {
      setClearBusy(false);
    }
  };

  const handleOpenNotification = async (notification) => {
    if (!notification) return;

    if (!notification.read) {
      await handleMarkRead(String(notification._id));
    }

    if (notification.route) {
      if (notification.projectId) {
        localStorage.setItem('selectedProject', String(notification.projectId));
      }
      navigate(notification.route);
      return;
    }

    if (notification.projectId) {
      localStorage.setItem('selectedProject', String(notification.projectId));
    }

    if (notification.taskId || notification.type === 'deadline') {
      navigate(notification.projectId ? `/project/${notification.projectId}` : '/tasks');
      return;
    }

    if (notification.type === 'project' && notification.projectId) {
      navigate(`/project/${notification.projectId}`);
      return;
    }

    if (notification.type === 'mention') {
      navigate('/messages');
      return;
    }

    if (notification.type === 'file') {
      navigate('/files');
    }
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent-warm-grey">Notifications</h1>
          <p className="mt-1 text-text-default">Stay updated with team activity and task assignments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadNotifications({ replace: true })}
            disabled={loading || loadingMore}
            className="inline-flex items-center gap-2 rounded-xl bg-background-light-sand px-4 py-2 text-text-default transition-all hover:bg-primary-soft-sky/20 disabled:opacity-60"
          >
            <RefreshCcw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Refresh
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={markAllBusy || notifications.length === 0}
            className="rounded-xl bg-background-light-sand px-4 py-2 text-text-default transition-all hover:bg-primary-soft-sky/20 disabled:opacity-60"
          >
            {markAllBusy ? 'Marking...' : 'Mark All Read'}
          </button>
          <button
            onClick={handleClearAll}
            disabled={clearBusy || notifications.length === 0}
            className="rounded-xl bg-primary-dusty-blue px-4 py-2 font-medium text-background-warm-off-white transition-all hover:bg-primary-soft-sky disabled:opacity-60"
          >
            {clearBusy ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-[#88C0D0]/25 bg-background-warm-off-white px-4 py-3 text-sm text-text-default">
          {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'You are all caught up'}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {FILTERS.filter((item) => item !== 'all').map((type) => (
            <div key={type} className="rounded-2xl border border-[#88C0D0]/20 bg-background-warm-off-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-text-muted">{type}</p>
              <p className="text-sm font-semibold text-accent-warm-grey">
                {counts[type]?.unread || 0} unread
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-4 py-3 text-sm text-[#4C566A]">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => loadNotifications({ replace: true })}
              className="rounded-lg bg-background-warm-off-white px-3 py-1 text-xs font-medium text-accent-warm-grey"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === type
                ? 'bg-primary-dusty-blue text-background-warm-off-white shadow-md'
                : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ARCHIVE_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setArchiveView(item.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              archiveView === item.id
                ? 'bg-primary-soft-sky/25 text-primary-dusty-blue ring-1 ring-primary-soft-sky/40'
                : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUnreadOnly((prev) => !prev)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            unreadOnly
              ? 'bg-primary-soft-sky/25 text-primary-dusty-blue ring-1 ring-primary-soft-sky/40'
              : 'bg-background-light-sand text-text-default hover:bg-primary-soft-sky/20'
          }`}
        >
          Unread Only
        </button>
      </div>

      <div className="rounded-2xl border border-[#88C0D0]/25 bg-background-warm-off-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAllVisible}
            disabled={!visibleIds.length}
            className="inline-flex items-center gap-2 rounded-lg bg-background-light-sand px-3 py-2 text-sm text-accent-warm-grey disabled:opacity-50"
          >
            {allVisibleSelected ? <SquareCheckBig className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            {allVisibleSelected ? 'Clear Selection' : 'Select Visible'}
          </button>
          <span className="text-sm text-text-default">{selectedIds.length} selected</span>
          <button
            type="button"
            onClick={() => handleBulkAction('read')}
            disabled={!selectedIds.length || !!bulkBusy}
            className="rounded-lg bg-background-light-sand px-3 py-2 text-sm text-accent-warm-grey disabled:opacity-50"
          >
            {bulkBusy === 'read' ? 'Marking...' : 'Mark Read'}
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('unread')}
            disabled={!selectedIds.length || !!bulkBusy}
            className="rounded-lg bg-background-light-sand px-3 py-2 text-sm text-accent-warm-grey disabled:opacity-50"
          >
            {bulkBusy === 'unread' ? 'Updating...' : 'Mark Unread'}
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction(archiveView === 'archived' ? 'unarchive' : 'archive')}
            disabled={!selectedIds.length || !!bulkBusy}
            className="rounded-lg bg-background-light-sand px-3 py-2 text-sm text-accent-warm-grey disabled:opacity-50"
          >
            {bulkBusy === 'archive' || bulkBusy === 'unarchive'
              ? 'Updating...'
              : archiveView === 'archived'
                ? 'Unarchive'
                : 'Archive'}
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('delete')}
            disabled={!selectedIds.length || !!bulkBusy}
            className="rounded-lg bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A] disabled:opacity-50"
          >
            {bulkBusy === 'delete' ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <NotificationSkeleton />}

        {!loading &&
          visibleNotifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            const readBusy = Boolean(itemBusy[`${notification._id}:read`]);
            const unreadBusy = Boolean(itemBusy[`${notification._id}:unread`]);
            const deleteBusy = Boolean(itemBusy[`${notification._id}:delete`]);
            const archiveBusy = Boolean(itemBusy[`${notification._id}:archive`]);
            const unarchiveBusy = Boolean(itemBusy[`${notification._id}:unarchive`]);
            const isSelected = selectedIds.includes(String(notification._id));

            return (
              <motion.div
                key={String(notification._id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative rounded-2xl border p-4 transition-all ${
                  notification.archivedAt
                    ? 'border-[#D9E1D7] bg-background-light-sand/70'
                    : notification.read
                      ? 'border-[#88C0D0]/25 bg-background-warm-off-white hover:shadow-md'
                      : 'border-primary-soft-sky/50 bg-primary-soft-sky/10 ring-2 ring-primary-soft-sky/20 shadow-lg hover:shadow-xl'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => toggleSelected(String(notification._id))}
                    className="mt-1 text-primary-dusty-blue"
                  >
                    {isSelected ? <SquareCheckBig className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </button>

                  <button
                    type="button"
                    className="flex flex-1 items-start gap-4 text-left"
                    onClick={() => handleOpenNotification(notification)}
                  >
                    <div className="mt-0.5 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary-dusty-blue to-primary-soft-sky p-2 text-background-warm-off-white shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <div className="mb-1 flex items-start justify-between">
                        <h3 className="pr-6 font-semibold leading-tight text-accent-warm-grey">{notification.title}</h3>
                        <span
                          className="ml-4 flex-shrink-0 whitespace-nowrap text-xs text-text-muted"
                          title={new Date(notification.createdAt).toLocaleString()}
                        >
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-text-default">{notification.message}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span className="rounded-full bg-background-light-sand px-2 py-1">{notification.type}</span>
                        <span className="rounded-full bg-background-light-sand px-2 py-1">
                          {notification.priority || 'normal'} priority
                        </span>
                        {notification.actorName && (
                          <span className="rounded-full bg-background-light-sand px-2 py-1">by {notification.actorName}</span>
                        )}
                        {notification.archivedAt && (
                          <span className="rounded-full bg-background-light-sand px-2 py-1">archived</span>
                        )}
                      </div>
                    </div>
                  </button>

                  <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
                    {!notification.read ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMarkRead(String(notification._id));
                        }}
                        disabled={readBusy}
                        className="inline-flex items-center gap-1 rounded-lg bg-background-warm-off-white px-2.5 py-1.5 text-xs font-medium text-primary-dusty-blue transition hover:bg-background-light-sand disabled:opacity-60"
                      >
                        {readBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Read
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMarkUnread(String(notification._id));
                        }}
                        disabled={unreadBusy}
                        className="inline-flex items-center gap-1 rounded-lg bg-background-warm-off-white px-2.5 py-1.5 text-xs font-medium text-primary-dusty-blue transition hover:bg-background-light-sand disabled:opacity-60"
                      >
                        {unreadBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                        Unread
                      </button>
                    )}

                    {notification.archivedAt ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleArchive(String(notification._id), false);
                        }}
                        disabled={unarchiveBusy}
                        className="inline-flex items-center gap-1 rounded-lg bg-background-warm-off-white px-2.5 py-1.5 text-xs font-medium text-[#4C566A] transition hover:bg-background-light-sand disabled:opacity-60"
                      >
                        {unarchiveBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArchiveRestore className="h-3.5 w-3.5" />}
                        Unarchive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleArchive(String(notification._id), true);
                        }}
                        disabled={archiveBusy}
                        className="inline-flex items-center gap-1 rounded-lg bg-background-warm-off-white px-2.5 py-1.5 text-xs font-medium text-[#4C566A] transition hover:bg-background-light-sand disabled:opacity-60"
                      >
                        {archiveBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
                        Archive
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(String(notification._id));
                      }}
                      disabled={deleteBusy}
                      className="inline-flex items-center gap-1 rounded-lg bg-background-warm-off-white px-2.5 py-1.5 text-xs font-medium text-[#4C566A] transition hover:bg-background-light-sand disabled:opacity-60"
                    >
                      {deleteBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete
                    </button>

                    {!notification.read && !notification.archivedAt && (
                      <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-dusty-blue animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

        {!loading && visibleNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-[#88C0D0]/25 bg-background-warm-off-white py-16 text-center"
          >
            <Bell className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <h3 className="mb-2 text-xl font-semibold text-text-main">No notifications</h3>
            <p className="text-text-muted">Try adjusting the type, unread, or archive filters.</p>
          </motion.div>
        )}

        {!loading && canLoadMore && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => loadNotifications({ cursor: nextCursor })}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-xl bg-background-light-sand px-4 py-2 text-sm font-medium text-accent-warm-grey transition hover:bg-primary-soft-sky/20 disabled:opacity-60"
            >
              {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
