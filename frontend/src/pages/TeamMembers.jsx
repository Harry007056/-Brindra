import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, MoreVertical, MapPin, Plus, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../api';

const roleTitle = {
  team_leader: 'Team Leader',
  manager: 'Manager',
  member: 'Member',
};

const colorPalette = [
  'from-[#E07A5F] to-[#E07A5F]',
  'from-primary-dusty-blue to-primary-soft-sky',
  'from-[#A3BE8C] to-[#6B8E23]',
  'from-[#5E81AC] to-[#88C0D0]',
];

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NA';

export default function TeamMembers({ setActiveView }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'member',
    workspaceName: 'Team Workspace',
    password: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/collab/users');
        if (!isMounted) return;
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch {
        if (!isMounted) return;
        setError('Failed to load team members');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    setCreating(true);
    try {
      // Use provided password or generate a random one
      const password = newMember.password.trim() || Math.random().toString(36).slice(-8);
      
      const response = await api.post('/auth/register', {
        ...newMember,
        password,
      });

      setUsers(prev => [...prev, response.data.user]);
      setModalOpen(false);
      setNewMember({
        name: '',
        email: '',
        role: 'member',
        workspaceName: 'Team Workspace',
        password: ''
      });
      
      // Show the password to the user
      alert(`Member created successfully! Password: ${password}\nPlease share this with the new member.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create member');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMember = async (userId, userName) => {
    if (!confirm(`Are you sure you want to remove ${userName} from the team? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/collab/users/${userId}`);
      setUsers(prev => prev.filter(user => String(user._id) !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const visibleMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((member) => {
      return String(member.name || '').toLowerCase().includes(term) || String(member.email || '').toLowerCase().includes(term);
    });
  }, [search, users]);

  const getStatusClass = (isActive) => (isActive === false ? 'bg-slate-300' : 'bg-secondary-sage-green');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-warm-grey">Team Members</h1>
          <p className="text-text-default">Manage your team and collaborate effectively.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search team members..."
              className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMembers.map((member, index) => {
          const gradient = colorPalette[index % colorPalette.length];
          const isActive = member.isActive !== false;
          return (
            <motion.div
              key={String(member._id)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-background-warm-off-white`}>
                      {initials(member.name)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${getStatusClass(isActive)}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-accent-warm-grey">{member.name}</h3>
                    <p className="text-sm text-text-default">{roleTitle[member.role] || 'Member'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-600" 
                    type="button"
                    onClick={() => handleDeleteMember(String(member._id), member.name)}
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey" type="button">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-background-light-sand p-3">
                <div className="flex items-center gap-2 text-sm text-text-default">
                  <Mail className="h-4 w-4 text-primary-dusty-blue" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-default">
                  <MapPin className="h-4 w-4 text-primary-dusty-blue" />
                  <span>{member.workspaceName || 'Workspace not set'}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
                  onClick={() => {
                    localStorage.setItem('chatTarget', String(member._id || member.name || ''));
                    localStorage.setItem('chatMode', 'direct');
                    if (setActiveView) {
                      setActiveView('chat');
                    }
                    navigate('/messages');
                  }}
                  type="button"
                >
                  <Mail className="h-4 w-4" />
                  Message
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!loading && visibleMembers.length === 0 && <p className="text-sm text-text-default">No team members found.</p>}
      {loading && <p className="text-sm text-text-default">Loading members...</p>}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft-sky/20 px-3 py-1 text-xs font-medium text-primary-dusty-blue">
            <Users className="h-3.5 w-3.5" />
            Add Team Member
          </div>
          <h2 className="text-xl font-semibold text-accent-warm-grey">Invite New Member</h2>
          <form onSubmit={handleCreateMember} className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Full Name</span>
              <input
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                required
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Email Address</span>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                required
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Password <span className="text-text-default/60">(leave empty to auto-generate)</span></span>
              <input
                type="password"
                value={newMember.password}
                onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password or leave empty"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Role</span>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="team_leader">Team Leader</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Workspace</span>
              <input
                value={newMember.workspaceName}
                onChange={(e) => setNewMember(prev => ({ ...prev, workspaceName: e.target.value }))}
                placeholder="Team Workspace"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {creating ? 'Creating...' : 'Add Member'}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
