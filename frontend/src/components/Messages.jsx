import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { clsx } from 'clsx';
import api from '../api';

const POLL_INTERVAL_MS = 3000;

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NA';

const timeLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const byNewest = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
const byOldest = (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState('');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [authUserId, setAuthUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let pollTimer = null;

    const pullMessages = async (userId) => {
      try {
        const response = await api.get('/collab/messages', { params: { userId } });
        if (!isMounted) return;
        const data = Array.isArray(response.data) ? response.data.slice().sort(byNewest) : [];
        setMessages(data);
      } catch {
        if (isMounted) setError('Failed to refresh messages');
      }
    };

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, meRes, projectsRes] = await Promise.all([api.get('/collab/users'), api.get('/auth/me'), api.get('/collab/projects')]);

        if (!isMounted) return;

        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        const meId = String(meRes.data?.user?.id || '');

        setUsers(usersData);
        setProjects(projectsData);
        setAuthUserId(meId);

        await pullMessages(meId);

        const initialTarget = localStorage.getItem('chatTarget');
        const matchedUser = usersData.find((u) => u.name === initialTarget || String(u._id) === initialTarget);
        const fallbackUser = usersData.find((u) => String(u._id) !== meId);

        if (matchedUser && String(matchedUser._id) !== meId) {
          setActiveChat(String(matchedUser._id));
          localStorage.removeItem('chatTarget');
        } else if (fallbackUser?._id) {
          setActiveChat(String(fallbackUser._id));
        }

        pollTimer = setInterval(() => {
          pullMessages(meId);
        }, POLL_INTERVAL_MS);
      } catch {
        if (!isMounted) return;
        setError('Failed to load messages');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  const conversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users
      .filter((user) => String(user._id) !== String(authUserId))
      .filter((user) => {
        if (!term) return true;
        return String(user.name || '').toLowerCase().includes(term) || String(user.email || '').toLowerCase().includes(term);
      })
      .map((user) => {
        const userId = String(user._id);
        const latest = messages.find(
          (msg) =>
            (String(msg.senderId) === userId && String(msg.receiverId) === String(authUserId)) ||
            (String(msg.senderId) === String(authUserId) && String(msg.receiverId) === userId)
        );

        return {
          id: userId,
          name: user.name,
          lastMessage: latest?.body || 'No messages yet',
          time: latest?.createdAt ? timeLabel(latest.createdAt) : '',
          unread: 0,
          avatar: initials(user.name),
          online: user.isActive !== false,
        };
      });
  }, [authUserId, messages, search, users]);

  const activeConversation = conversations.find((conv) => conv.id === activeChat) || conversations[0] || null;
  const defaultProjectId = projects[0]?._id ? String(projects[0]._id) : '';

  const activeMessages = useMemo(() => {
    if (!activeConversation || !authUserId) return [];
    return messages
      .filter(
        (msg) =>
          (String(msg.senderId) === String(activeConversation.id) && String(msg.receiverId) === String(authUserId)) ||
          (String(msg.senderId) === String(authUserId) && String(msg.receiverId) === String(activeConversation.id))
      )
      .slice()
      .sort(byOldest);
  }, [activeConversation, authUserId, messages]);

  const handleSend = async () => {
    const body = newMessage.trim();
    if (!body || !activeConversation?.id || !authUserId) return;

    setSending(true);
    try {
      const response = await api.post('/collab/messages', {
        body,
        senderId: authUserId,
        receiverId: activeConversation.id,
        ...(defaultProjectId ? { projectId: defaultProjectId } : {}),
      });

      const saved = response.data || {};
      const normalized = {
        ...saved,
        senderId: saved.senderId || authUserId,
        receiverId: saved.receiverId || activeConversation.id,
      };
      setMessages((prev) => [normalized, ...prev]);
      setNewMessage('');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to send message';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Messages</h1>
        <p className="text-text-default">Chat with your team members in real-time.</p>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]"
      >
        <div className="overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="border-b border-[#88C0D0]/20 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className={clsx(
                  'mb-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition',
                  activeChat === conv.id
                    ? 'bg-primary-soft-sky/25 ring-1 ring-primary-soft-sky/40'
                    : 'hover:bg-background-light-sand'
                )}
                type="button"
              >
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-dusty-blue text-xs font-semibold text-background-warm-off-white">
                    {conv.avatar}
                  </div>
                  {conv.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary-sage-green ring-2 ring-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-accent-warm-grey">{conv.name}</span>
                    <span className="text-xs text-text-default">{conv.time}</span>
                  </div>
                  <p className="truncate text-xs text-text-default">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#88C0D0]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-dusty-blue to-primary-soft-sky text-xs font-semibold text-background-warm-off-white">
                  {activeConversation?.avatar || 'NA'}
                </div>
                {activeConversation?.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary-sage-green ring-2 ring-white" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-warm-grey">{activeConversation?.name || 'Select a conversation'}</h3>
                <p className="text-xs text-text-default">{activeConversation?.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-light-sand" type="button">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-light-sand" type="button">
                <Video className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey" type="button">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background-warm-off-white/60 p-4">
            {activeMessages.map((msg) => {
              const isMe = String(msg.senderId) === String(authUserId);
              return (
                <motion.div
                  key={String(msg._id)}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={clsx('flex gap-2', isMe ? 'justify-end' : 'justify-start')}
                >
                  {!isMe && (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-dusty-blue text-[10px] font-semibold text-background-warm-off-white">
                      {initials(activeConversation?.name)}
                    </div>
                  )}
                  <div
                    className={clsx(
                      'max-w-[75%] rounded-2xl px-3 py-2 shadow-sm',
                      isMe ? 'rounded-tr-sm bg-primary-dusty-blue text-background-warm-off-white' : 'rounded-tl-sm bg-background-warm-off-white text-accent-warm-grey'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.body}</p>
                    <p className={clsx('mt-1 text-[11px]', isMe ? 'text-background-warm-off-white/80' : 'text-text-default')}>
                      {timeLabel(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {!loading && activeMessages.length === 0 && <p className="text-sm text-text-default">No messages yet.</p>}
          </div>

          <div className="border-t border-[#88C0D0]/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2">
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-accent-warm-grey outline-none placeholder:text-text-default"
              />
              <button className="rounded-lg p-2 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button">
                <Smile className="h-4 w-4" />
              </button>
              <button
                className="rounded-lg bg-primary-dusty-blue p-2 text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSend}
                disabled={sending || !newMessage.trim() || !activeConversation?.id || !authUserId}
                type="button"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {loading && <p className="text-sm text-text-default">Loading messages...</p>}
    </div>
  );
}
