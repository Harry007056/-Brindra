import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Edit3, MessageSquare, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';

const isMongoObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ''));

const fromNow = (value) => {
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

export default function ProjectDetails({ authUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [taskActionLoading, setTaskActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // projectId from route params

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const safeQuery = isMongoObjectId(id) ? { params: { projectId: id } } : undefined;
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          api.get('/collab/projects'),
          api.get('/collab/tasks', safeQuery),
          api.get('/collab/users'),
        ]);

        if (!isMounted) return;

        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        setProject(projects.find((item) => String(item._id) === String(id)) || null);
        const allTasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        setTasks(allTasks.filter((item) => String(item.projectId) === String(id)));
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch {
        if (!isMounted) return;
        setError('Failed to load project details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const userById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[String(user._id)] = user;
      return acc;
    }, {});
  }, [users]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const members = useMemo(() => {
    const ids = new Set(tasks.map((task) => String(task.assigneeId || '')).filter(Boolean));
    if (project?.ownerId) ids.add(String(project.ownerId));
    return [...ids]
      .map((id) => userById[id]?.name)
      .filter(Boolean)
      .slice(0, 8);
  }, [project, tasks, userById]);

  const dueDate = useMemo(() => {
    const upcoming = tasks.filter((task) => task.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return upcoming[0]?.dueDate ? new Date(upcoming[0].dueDate).toLocaleDateString() : 'Not set';
  }, [tasks]);

  const isTeamLeader = String(authUser?.role || '') === 'team_leader';
  const assignableMembers = useMemo(() => {
    return users
      .filter((user) => user.isActive !== false)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  }, [users]);

  const reloadTasks = async () => {
    if (!id) return;
    const safeQuery = isMongoObjectId(id) ? { params: { projectId: id } } : undefined;
    const response = await api.get('/collab/tasks', safeQuery);
    const allTasks = Array.isArray(response.data) ? response.data : [];
    setTasks(allTasks.filter((item) => String(item.projectId) === String(id)));
  };

  const handleCreateTask = async () => {
    const title = newTaskTitle.trim();
    if (!title || !id) return;

    try {
      setTaskActionLoading(true);
      await api.post('/collab/tasks', {
        projectId: id,
        title,
        assigneeId: newTaskAssigneeId || null,
        dueDate: newTaskDueDate || null,
        completed: false,
      });
      setNewTaskTitle('');
      setNewTaskAssigneeId('');
      setNewTaskDueDate('');
      await reloadTasks();
      toast.success('Task created and assigned');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, patch) => {
    try {
      setTaskActionLoading(true);
      const response = await api.put(`/collab/tasks/${taskId}`, patch);
      const updated = response.data;
      setTasks((prev) => prev.map((task) => (String(task._id) === String(taskId) ? updated : task)));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update task');
    } finally {
      setTaskActionLoading(false);
    }
  };



  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <button
            className="mb-2 text-sm text-primary-dusty-blue hover:text-primary-soft-sky"
            onClick={() => navigate('/projects')}
            type="button"
          >
            Back
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-accent-warm-grey">{project?.name || 'Project Details'}</h1>
            <p className="max-w-3xl text-sm text-text-default">{project?.description || 'No description available.'}</p>
          </div>
          <span className="rounded-full bg-primary-soft-sky/25 px-3 py-1 text-xs font-medium text-[#4C566A]">
            {project?.status || 'active'}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-text-default">
            <span>Overall Progress</span>
            <span className="font-medium text-accent-warm-grey">{progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-background-light-sand">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-dusty-blue to-primary-soft-sky" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Project Info</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Calendar className="h-4 w-4 text-primary-dusty-blue" />
              Due Date: {dueDate}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Users className="h-4 w-4 text-primary-dusty-blue" />
              Team: {members.length} member(s)
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background-light-sand p-3 text-sm text-text-default">
              <Clock className="h-4 w-4 text-primary-dusty-blue" />
              Last Updated: {fromNow(project?.updatedAt)}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Members</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {members.map((member, idx) => (
              <span
                key={`${member}-${idx}`}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-background-warm-off-white ${
                  ['bg-primary-dusty-blue', 'bg-secondary-sage-green', 'bg-accent-muted-coral', 'bg-[#88C0D0]'][idx % 4]
                }`}
              >
                {member}
              </span>
            ))}
            {!members.length && <p className="text-sm text-text-default">No assigned members.</p>}
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky" type="button">
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#E07A5F]/35 bg-[#E07A5F]/10 px-3 py-2 text-sm font-medium text-[#4C566A] transition hover:bg-[#E07A5F]/20" type="button">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-accent-warm-grey">Milestones</h2>
          {isTeamLeader && (
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl bg-background-light-sand p-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_170px_auto]">
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none md:col-span-2 xl:col-span-1"
              />
              <select
                value={newTaskAssigneeId}
                onChange={(event) => setNewTaskAssigneeId(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-2 py-2 text-sm text-accent-warm-grey outline-none"
              >
                <option value="">Assign member</option>
                {assignableMembers.map((member) => (
                  <option key={String(member._id)} value={String(member._id)}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(event) => setNewTaskDueDate(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-2 py-2 text-sm text-accent-warm-grey outline-none"
              />
              <button
                type="button"
                onClick={handleCreateTask}
                disabled={taskActionLoading || !newTaskTitle.trim()}
                className="whitespace-nowrap rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white disabled:opacity-60 md:col-span-2 xl:col-span-1"
              >
                Add
              </button>
            </div>
          )}
          <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
            {tasks.map((item) => (
              <li key={String(item._id)} className="flex items-center justify-between rounded-xl bg-background-light-sand px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm text-accent-warm-grey">{item.title}</p>
                  <p className="text-xs text-text-default">
                    Assigned: {userById[String(item.assigneeId)]?.name || 'Unassigned'}
                    {item.dueDate ? ` • Due ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isTeamLeader && (
                    <select
                      value={String(item.assigneeId || '')}
                      onChange={(event) => handleTaskUpdate(String(item._id), { assigneeId: event.target.value || null })}
                      disabled={taskActionLoading}
                      className="rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-2 py-1 text-xs text-accent-warm-grey outline-none"
                    >
                      <option value="">Unassigned</option>
                      {assignableMembers.map((member) => (
                        <option key={String(member._id)} value={String(member._id)}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {isTeamLeader ? (
                    <button
                      type="button"
                      onClick={() => handleTaskUpdate(String(item._id), { completed: !item.completed })}
                      disabled={taskActionLoading}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                        item.completed
                          ? 'bg-secondary-sage-green/25 text-secondary-olive-accent'
                          : 'bg-primary-soft-sky/25 text-primary-dusty-blue'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.completed ? 'Completed' : 'Mark Done'}
                    </button>
                  ) : item.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-olive-accent">
                      <CheckCircle2 className="h-4 w-4" />
                      Done
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-text-default">Pending</span>
                  )}
                </div>
              </li>
            ))}
            {!loading && tasks.length === 0 && <li className="text-sm text-text-default">No milestones yet.</li>}
          </ul>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-dusty-blue" />
            <h2 className="text-lg font-semibold text-accent-warm-grey">Group Chat</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
          >
            <MessageSquare className="h-4 w-4" />
            Group Message
          </button>
        </motion.section>
      </div>

      {loading && <p className="text-sm text-text-default">Loading project details...</p>}
    </div>
  );
}
