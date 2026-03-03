import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Send, Users, Loader2, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { io } from 'socket.io-client';
import api from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const isMongoObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ''));
const SYNC_INTERVAL_MS = 5000;

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NA';

const timeLabel = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const byCreatedAsc = (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

const appendUniqueMessage = (list, message) => {
  const id = String(message?._id || '');
  if (!id) return [...list, message].sort(byCreatedAsc);
  if (list.some((item) => String(item?._id || '') === id)) return list;
  return [...list, message].sort(byCreatedAsc);
};

const projectIdOf = (message) => {
  const value = message?.projectId;
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return String(value._id);
  return String(value);
};

const senderIdOf = (message) => {
  const value = message?.senderId;
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return String(value._id);
  return String(value);
};

const receiverIdOf = (message) => {
  const value = message?.receiverId;
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return String(value._id);
  return String(value);
};

const isDirectMessage = (message) => Boolean(senderIdOf(message) && receiverIdOf(message));

const directPeerId = (message, meId) => {
  const senderId = senderIdOf(message);
  const receiverId = receiverIdOf(message);
  if (!senderId || !receiverId || !meId) return '';
  if (senderId === meId) return receiverId;
  if (receiverId === meId) return senderId;
  return '';
};

const roleBubbleClass = (role, isMe) => {
  if (isMe) return 'bg-primary-dusty-blue text-background-warm-off-white';
  if (role === 'team_leader') return 'bg-[#E07A5F]/20 text-accent-warm-grey';
  if (role === 'manager') return 'bg-secondary-sage-green/25 text-accent-warm-grey';
  return 'bg-primary-soft-sky/25 text-accent-warm-grey';
};

export default function Chat() {
  const [authUser, setAuthUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [mode, setMode] = useState('project');
  const [activeProjectId, setActiveProjectId] = useState('');
  const [activeDirectUserId, setActiveDirectUserId] = useState('');

  const [projectMessages, setProjectMessages] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [allDirectMessages, setAllDirectMessages] = useState([]);

  const [projectTypingUsers, setProjectTypingUsers] = useState([]);
  const [directTypingUsers, setDirectTypingUsers] = useState([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const joinedUserIdRef = useRef('');
  const joinedProjectIdRef = useRef('');

  const modeRef = useRef('project');
  const activeProjectIdRef = useRef('');
  const activeDirectUserIdRef = useRef('');
  const authUserIdRef = useRef('');

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    activeProjectIdRef.current = activeProjectId;
  }, [activeProjectId]);

  useEffect(() => {
    activeDirectUserIdRef.current = activeDirectUserId;
  }, [activeDirectUserId]);

  useEffect(() => {
    authUserIdRef.current = String(authUser?.id || '');
  }, [authUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [projectMessages.length, directMessages.length, mode, activeProjectId, activeDirectUserId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const fetchProjectMessages = async (projectId) => {
    if (!projectId || !isMongoObjectId(projectId)) {
      setProjectMessages([]);
      return;
    }

    const response = await api.get('/collab/messages', { params: { projectId } });
    const data = Array.isArray(response.data) ? response.data.slice().sort(byCreatedAsc) : [];
    setProjectMessages(data);
  };

  const fetchDirectMessages = async (meId, peerId) => {
    if (!meId || !peerId || !isMongoObjectId(meId) || !isMongoObjectId(peerId)) {
      setDirectMessages([]);
      return;
    }

    const response = await api.get('/collab/messages', { params: { userId: meId, peerId } });
    const data = Array.isArray(response.data) ? response.data.slice().sort(byCreatedAsc) : [];
    setDirectMessages(data);
  };

  const fetchAllDirectMessages = async (meId) => {
    if (!meId || !isMongoObjectId(meId)) {
      setAllDirectMessages([]);
      return;
    }

    const response = await api.get('/collab/messages', { params: { userId: meId } });
    const data = Array.isArray(response.data) ? response.data : [];
    const directOnly = data.filter((item) => isDirectMessage(item));
    setAllDirectMessages(directOnly.slice().sort(byCreatedAsc));
  };

  useEffect(() => {
    let mounted = true;
    let syncTimer = null;

    const bootstrap = async () => {
      setLoading(true);
      setError('');

      try {
        const [meRes, usersRes, projectsRes, tasksRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/collab/users'),
          api.get('/collab/projects'),
          api.get('/collab/tasks'),
        ]);

        if (!mounted) return;

        const me = meRes.data?.user || null;
        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        const tasksData = Array.isArray(tasksRes.data) ? tasksRes.data : [];

        setAuthUser(me);
        setUsers(usersData);
        setProjects(projectsData);
        setTasks(tasksData);

        const meId = String(me?.id || '');
        authUserIdRef.current = meId;
        const meRole = String(me?.role || 'member');

        const assignedProjectIds = new Set(
          tasksData
            .filter((task) => String(task.assigneeId || '') === meId)
            .map((task) => String(task.projectId || ''))
            .filter(Boolean)
        );

        const visibleProjects = projectsData.filter((project) => {
          if (meRole === 'team_leader' || meRole === 'manager') return true;
          if (String(project.ownerId || '') === meId) return true;
          return assignedProjectIds.has(String(project._id));
        });

        const requestedProjectId = localStorage.getItem('selectedProject');
        const requestedChatTarget = localStorage.getItem('chatTarget');
        const requestedChatMode = localStorage.getItem('chatMode');
        const initialProject =
          visibleProjects.find((item) => String(item._id) === String(requestedProjectId)) || visibleProjects[0] || null;

        const selectedProjectId = initialProject ? String(initialProject._id) : '';
        setActiveProjectId(selectedProjectId);

        const targetUser = usersData.find(
          (user) =>
            String(user._id) === String(requestedChatTarget || '') ||
            String(user.name || '') === String(requestedChatTarget || '')
        );

        if (requestedChatMode === 'direct' && targetUser && String(targetUser._id) !== meId) {
          setMode('direct');
          setActiveDirectUserId(String(targetUser._id));
        } else {
          setMode('project');
        }

        if (selectedProjectId) {
          await fetchProjectMessages(selectedProjectId);
        }

        if (requestedChatMode === 'direct' && targetUser && String(targetUser._id) !== meId) {
          await fetchDirectMessages(meId, String(targetUser._id));
        }
        await fetchAllDirectMessages(meId);

        const socket = io(SOCKET_URL, {
          withCredentials: true,
          transports: ['polling', 'websocket'],
          upgrade: false,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          if (meId) {
            socket.emit('join_user', meId);
            joinedUserIdRef.current = meId;
          }
          if (selectedProjectId) {
            socket.emit('join_project', selectedProjectId);
            joinedProjectIdRef.current = selectedProjectId;
          }
        });

        socket.on('project_message:new', (incoming) => {
          if (!incoming) return;
          const currentProjectId = activeProjectIdRef.current || selectedProjectId;
          if (String(projectIdOf(incoming) || '') !== String(currentProjectId || '')) return;
          setProjectMessages((prev) => appendUniqueMessage(prev, incoming));
        });

        socket.on('direct_message:new', (incoming) => {
          if (!incoming) return;
          const meCurrent = authUserIdRef.current;
          const peerCurrent = activeDirectUserIdRef.current;
          const senderId = senderIdOf(incoming);
          const receiverId = receiverIdOf(incoming);

          const isMine = senderId === meCurrent || receiverId === meCurrent;
          const isInCurrentThread =
            (senderId === meCurrent && receiverId === peerCurrent) ||
            (senderId === peerCurrent && receiverId === meCurrent);

          if (isMine) {
            setAllDirectMessages((prev) => appendUniqueMessage(prev, incoming));
          }

          if (isMine && isInCurrentThread) {
            setDirectMessages((prev) => appendUniqueMessage(prev, incoming));
          }
        });

        socket.on('project_typing', (payload) => {
          if (!payload) return;
          if (String(payload.projectId || '') !== String(activeProjectIdRef.current || '')) return;
          setProjectTypingUsers((prev) => {
            const exists = prev.find((item) => item.userId === payload.userId);
            if (payload.isTyping) {
              if (exists) return prev;
              return [...prev, { userId: payload.userId, userName: payload.userName }];
            }
            return prev.filter((item) => item.userId !== payload.userId);
          });
        });

        socket.on('direct_typing', (payload) => {
          if (!payload) return;
          if (String(payload.senderId || '') !== String(activeDirectUserIdRef.current || '')) return;
          setDirectTypingUsers((prev) => {
            const exists = prev.find((item) => item.userId === payload.senderId);
            if (payload.isTyping) {
              if (exists) return prev;
              return [...prev, { userId: payload.senderId, userName: payload.senderName }];
            }
            return prev.filter((item) => item.userId !== payload.senderId);
          });
        });

        syncTimer = setInterval(() => {
          const meCurrent = authUserIdRef.current;
          const projectCurrent = activeProjectIdRef.current;
          const peerCurrent = activeDirectUserIdRef.current;
          const currentMode = modeRef.current;

          if (currentMode === 'project' && projectCurrent) {
            fetchProjectMessages(projectCurrent).catch(() => {});
          }

          if (currentMode === 'direct' && meCurrent && peerCurrent) {
            fetchDirectMessages(meCurrent, peerCurrent).catch(() => {});
          }

          if (meCurrent) {
            fetchAllDirectMessages(meCurrent).catch(() => {});
          }
        }, SYNC_INTERVAL_MS);

        localStorage.removeItem('chatMode');
        localStorage.removeItem('chatTarget');
      } catch {
        if (!mounted) return;
        setError('Failed to load chat data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
      if (syncTimer) clearInterval(syncTimer);

      const socket = socketRef.current;
      if (socket) {
        if (joinedUserIdRef.current) socket.emit('leave_user', joinedUserIdRef.current);
        if (joinedProjectIdRef.current) socket.emit('leave_project', joinedProjectIdRef.current);
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeProjectId) return;

    socket.emit('join_project', activeProjectId);
    joinedProjectIdRef.current = activeProjectId;

    fetchProjectMessages(activeProjectId)
      .then(() => setProjectTypingUsers([]))
      .catch(() => setError('Failed to load project chat'));

    return () => {
      socket.emit('leave_project', activeProjectId);
      if (joinedProjectIdRef.current === activeProjectId) joinedProjectIdRef.current = '';
    };
  }, [activeProjectId]);

  useEffect(() => {
    if (!activeDirectUserId || !authUserIdRef.current) return;

    fetchDirectMessages(authUserIdRef.current, activeDirectUserId)
      .then(() => setDirectTypingUsers([]))
      .catch(() => setError('Failed to load private chat'));
  }, [activeDirectUserId]);

  const userById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[String(user._id)] = user;
      return acc;
    }, {});
  }, [users]);

  const meId = String(authUser?.id || '');
  const meRole = String(authUser?.role || 'member');

  const visibleProjects = useMemo(() => {
    const assignedProjectIds = new Set(
      tasks
        .filter((task) => String(task.assigneeId || '') === meId)
        .map((task) => String(task.projectId || ''))
        .filter(Boolean)
    );

    return projects.filter((project) => {
      if (meRole === 'team_leader' || meRole === 'manager') return true;
      if (String(project.ownerId || '') === meId) return true;
      return assignedProjectIds.has(String(project._id));
    });
  }, [meId, meRole, projects, tasks]);

  const activeProject = visibleProjects.find((project) => String(project._id) === String(activeProjectId)) || null;

  const activeProjectMembers = useMemo(() => {
    if (!activeProject) return [];

    const memberIds = new Set();
    if (activeProject.ownerId) memberIds.add(String(activeProject.ownerId));

    tasks
      .filter((task) => String(task.projectId || '') === String(activeProject._id))
      .forEach((task) => {
        if (task.assigneeId) memberIds.add(String(task.assigneeId));
      });

    return [...memberIds]
      .map((id) => userById[id])
      .filter(Boolean)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  }, [activeProject, tasks, userById]);

  const activeDirectUser = users.find((user) => String(user._id) === String(activeDirectUserId)) || null;

  const privateChats = useMemo(() => {
    const recentByPeer = new Map();

    allDirectMessages.forEach((message) => {
      const peerId = directPeerId(message, meId);
      if (!peerId) return;

      const existing = recentByPeer.get(peerId);
      const createdAt = new Date(message.createdAt || 0).getTime();
      const existingAt = existing ? new Date(existing.createdAt || 0).getTime() : 0;
      if (!existing || createdAt > existingAt) {
        recentByPeer.set(peerId, message);
      }
    });

    if (activeDirectUserId && !recentByPeer.has(String(activeDirectUserId))) {
      recentByPeer.set(String(activeDirectUserId), {
        _id: `local-${activeDirectUserId}`,
        senderId: meId,
        receiverId: activeDirectUserId,
        body: '',
        createdAt: null,
      });
    }

    return [...recentByPeer.entries()]
      .map(([peerId, message]) => ({
        peerId,
        user: userById[peerId] || null,
        lastMessage: String(message.body || '').trim() || 'No messages yet',
        createdAt: message.createdAt,
      }))
      .filter((item) => item.user)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [activeDirectUserId, allDirectMessages, meId, userById]);

  const displayedMessages = mode === 'direct' ? directMessages : projectMessages;
  const typingUsers = mode === 'direct' ? directTypingUsers : projectTypingUsers;

  const handleSend = async () => {
    const body = input.trim();
    if (!body || !meId) return;

    setSending(true);
    setError('');

    try {
      if (mode === 'direct') {
        if (!activeDirectUserId) return;

        const response = await api.post('/collab/messages', {
          senderId: meId,
          receiverId: activeDirectUserId,
          body,
        });

        const saved = response.data || {};
        const normalized = {
          ...saved,
          senderId: senderIdOf(saved) || meId,
          receiverId: receiverIdOf(saved) || activeDirectUserId,
        };

        setDirectMessages((prev) => appendUniqueMessage(prev, normalized));
        setAllDirectMessages((prev) => appendUniqueMessage(prev, normalized));

        const socket = socketRef.current;
        if (socket) {
          socket.emit('direct_typing', {
            senderId: meId,
            receiverId: activeDirectUserId,
            senderName: authUser?.name || 'User',
            isTyping: false,
          });
        }
      } else {
        if (!activeProject) return;

        const response = await api.post('/collab/messages', {
          projectId: String(activeProject._id),
          senderId: meId,
          body,
        });

        const saved = response.data || {};
        const normalized = {
          ...saved,
          projectId: projectIdOf(saved) || String(activeProject._id),
          senderId: senderIdOf(saved) || meId,
        };

        setProjectMessages((prev) => appendUniqueMessage(prev, normalized));

        const socket = socketRef.current;
        if (socket) {
          socket.emit('project_typing', {
            projectId: String(activeProject._id),
            userId: meId,
            userName: authUser?.name || 'User',
            isTyping: false,
          });
        }
      }

      setInput('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const emitTyping = (nextValue) => {
    setInput(nextValue);

    const socket = socketRef.current;
    if (!socket || !meId) return;

    const isTyping = Boolean(nextValue.trim());

    if (mode === 'direct' && activeDirectUserId) {
      socket.emit('direct_typing', {
        senderId: meId,
        receiverId: activeDirectUserId,
        senderName: authUser?.name || 'User',
        isTyping,
      });
    }

    if (mode === 'project' && activeProject) {
      socket.emit('project_typing', {
        projectId: String(activeProject._id),
        userId: meId,
        userName: authUser?.name || 'User',
        isTyping,
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (modeRef.current === 'direct' && activeDirectUserIdRef.current) {
        socket.emit('direct_typing', {
          senderId: meId,
          receiverId: activeDirectUserIdRef.current,
          senderName: authUser?.name || 'User',
          isTyping: false,
        });
      }

      if (modeRef.current === 'project' && activeProjectIdRef.current) {
        socket.emit('project_typing', {
          projectId: activeProjectIdRef.current,
          userId: meId,
          userName: authUser?.name || 'User',
          isTyping: false,
        });
      }
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-1">
        <h1 className="text-3xl font-bold text-accent-warm-grey">Project Chat</h1>
        <p className="text-text-default">Team members and team leads can chat in real time by project or privately with a teammate.</p>
        {mode === 'direct' && activeDirectUser && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[#88C0D0]/35 bg-primary-soft-sky/20 px-3 py-1 text-xs font-semibold text-primary-dusty-blue">
            <MessageCircle className="h-3.5 w-3.5" />
            Private Chat with {activeDirectUser.name}
          </div>
        )}
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="grid h-[72vh] grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_300px]"
      >
        <aside className="h-full overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-3 shadow-sm">
          <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wide text-text-default">Projects</h2>
          <div className="max-h-[calc(36vh-2.5rem)] space-y-1 overflow-y-auto pr-1">
            {visibleProjects.map((project) => (
              <button
                key={String(project._id)}
                onClick={() => {
                  setMode('project');
                  setActiveProjectId(String(project._id));
                  localStorage.setItem('selectedProject', String(project._id));
                  setInput('');
                }}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition',
                  mode === 'project' && String(activeProjectId) === String(project._id)
                    ? 'bg-primary-dusty-blue text-background-warm-off-white ring-1 ring-primary-dusty-blue/50'
                    : 'text-accent-warm-grey hover:bg-background-light-sand'
                )}
                type="button"
              >
                <Hash
                  className={clsx(
                    'h-4 w-4',
                    mode === 'project' && String(activeProjectId) === String(project._id)
                      ? 'text-background-warm-off-white'
                      : 'text-primary-dusty-blue'
                  )}
                />
                <span className="truncate">{project.name}</span>
              </button>
            ))}
            {!loading && visibleProjects.length === 0 && <p className="px-2 py-2 text-xs text-text-default">No project chat available.</p>}
          </div>

          <h2 className="mb-2 mt-4 px-1 text-sm font-semibold uppercase tracking-wide text-text-default">Private Chats</h2>
          <div className="max-h-[calc(36vh-2.5rem)] space-y-1 overflow-y-auto pr-1">
            {privateChats.map((chat) => (
              <button
                key={chat.peerId}
                onClick={() => {
                  setMode('direct');
                  setActiveDirectUserId(chat.peerId);
                  setInput('');
                }}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition',
                  mode === 'direct' && String(activeDirectUserId) === String(chat.peerId)
                    ? 'bg-primary-soft-sky/25 text-[#4C566A] ring-1 ring-primary-soft-sky/40'
                    : 'text-accent-warm-grey hover:bg-background-light-sand'
                )}
                type="button"
              >
                <MessageCircle className="h-4 w-4 text-primary-dusty-blue" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{chat.user?.name || 'Unknown'}</p>
                  <p className="truncate text-xs text-text-default">{chat.lastMessage}</p>
                </div>
                <span className="text-[10px] text-text-default">{chat.createdAt ? timeLabel(chat.createdAt) : ''}</span>
              </button>
            ))}
            {!loading && privateChats.length === 0 && <p className="px-2 py-2 text-xs text-text-default">No private chats yet.</p>}
          </div>
        </aside>

        <main className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white shadow-sm">
          <div className="border-b border-[#88C0D0]/20 p-4">
            {mode === 'direct' ? (
              <>
                <h2 className="text-sm font-semibold text-accent-warm-grey">Private Chat: {activeDirectUser?.name || 'Select teammate'}</h2>
                <p className="text-xs text-text-default">One-to-one conversation with team member.</p>
              </>
            ) : (
              <>
                <h2 className="text-sm font-semibold text-accent-warm-grey">{activeProject?.name || 'Select a project'}</h2>
                <p className="text-xs text-text-default">{activeProject?.description || 'Project team chat room'}</p>
              </>
            )}
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background-warm-off-white/60 p-4">
            {displayedMessages.map((msg) => {
              const senderId = senderIdOf(msg);
              const isMe = senderId === meId;
              const senderUser = userById[senderId] || null;
              const sender = senderUser?.name || (isMe ? 'You' : 'Team Member');
              const senderRole = isMe ? String(authUser?.role || 'member') : String(senderUser?.role || 'member');

              return (
                <motion.div
                  key={String(msg._id || `${senderId}-${msg.createdAt}-${msg.body}`)}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={clsx('flex gap-2', isMe ? 'justify-end' : 'justify-start')}
                >
                  {!isMe && (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-dusty-blue text-[10px] font-semibold text-background-warm-off-white">
                      {initials(sender)}
                    </div>
                  )}
                  <div
                    className={clsx(
                      'max-w-[80%] rounded-2xl px-3 py-2 shadow-sm',
                      isMe ? 'rounded-tr-sm' : 'rounded-tl-sm',
                      roleBubbleClass(senderRole, isMe)
                    )}
                  >
                    <p className={clsx('mb-0.5 text-xs font-semibold', isMe ? 'text-background-warm-off-white/90' : 'text-primary-dusty-blue')}>
                      {isMe ? `${sender} (You)` : sender}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.body}</p>
                    <p className={clsx('mt-1 text-[11px]', isMe ? 'text-background-warm-off-white/80' : 'text-text-default')}>{timeLabel(msg.createdAt)}</p>
                  </div>
                </motion.div>
              );
            })}

            {!loading && mode === 'project' && activeProject && displayedMessages.length === 0 && <p className="text-sm text-text-default">No messages yet.</p>}
            {!loading && mode === 'direct' && activeDirectUser && displayedMessages.length === 0 && <p className="text-sm text-text-default">No private messages yet.</p>}

            {typingUsers.length > 0 && (
              <p className="text-xs text-text-default">
                {typingUsers.map((item) => item.userName).join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-[#88C0D0]/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2">
              <input
                type="text"
                value={input}
                onChange={(event) => emitTyping(event.target.value)}
                placeholder={
                  mode === 'direct'
                    ? activeDirectUser
                      ? `Message ${activeDirectUser.name}...`
                      : 'Select a teammate to start private chat'
                    : activeProject
                      ? 'Type a message...'
                      : 'Select a project to start chatting'
                }
                className="flex-1 bg-transparent px-1 text-sm text-accent-warm-grey outline-none placeholder:text-text-default"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSend();
                }}
              />
              <button
                onClick={handleSend}
                disabled={(mode === 'project' && !activeProject) || (mode === 'direct' && !activeDirectUser) || !input.trim() || sending}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </button>
            </div>
          </div>
        </main>

        <aside className="h-full overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Users className="h-4 w-4 text-primary-dusty-blue" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-default">Project Members</h2>
          </div>
          <div className="max-h-[calc(72vh-4.5rem)] space-y-1 overflow-y-auto pr-1">
            {activeProjectMembers.map((member) => {
              const memberId = String(member._id);
              const isActiveDirect = mode === 'direct' && String(activeDirectUserId) === memberId;
              return (
                <div key={memberId} className={clsx('rounded-xl px-2 py-2', isActiveDirect ? 'bg-primary-soft-sky/15' : 'hover:bg-background-light-sand')}>
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-dusty-blue text-[10px] font-semibold text-background-warm-off-white">
                      {initials(member.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-accent-warm-grey">{member.name}</p>
                      <p className="text-xs text-text-default">{String(member.role || '').replace('_', ' ')}</p>
                    </div>
                    {memberId !== meId && (
                      <button
                        className="inline-flex items-center gap-1 rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-2 py-1 text-xs font-medium text-primary-dusty-blue transition hover:bg-background-light-sand"
                        onClick={() => {
                          setMode('direct');
                          setActiveDirectUserId(memberId);
                          setInput('');
                        }}
                        type="button"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {!loading && activeProject && activeProjectMembers.length === 0 && <p className="px-2 py-2 text-xs text-text-default">No members assigned.</p>}
          </div>
        </aside>
      </motion.div>

      {loading && <p className="text-sm text-text-default">Loading chat...</p>}
    </div>
  );
}
