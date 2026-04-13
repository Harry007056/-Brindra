import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, MapPin, Plus, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

const roleTitle = {
  team_leader: 'Team Leader',
  manager: 'Manager',
  member: 'Member',
  admin: 'Admin',
};

const colorPalette = [
  'from-[#E07A5F] to-[#E07A5F]',
  'from-primary-dusty-blue to-primary-soft-sky',
  'from-[#A3BE8C] to-[#6B8E23]',
  'from-[#5E81AC] to-[#88C0D0]',
];

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'member',
  phone: '',
};

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'NA';

export default function TeamMembers({ setActiveView }) {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const canManageMembers = ['team_leader', 'manager', 'admin'].includes(String(authUser?.role || ''));

  const loadUsers = async () => {
    const response = await api.get('/collab/users');
    setUsers(Array.isArray(response.data) ? response.data : []);
  };

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

  const visibleMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((member) => {
      return String(member.name || '').toLowerCase().includes(term) || String(member.email || '').toLowerCase().includes(term);
    });
  }, [search, users]);

  const getStatusClass = (isActive) => (isActive === false ? 'bg-slate-300' : 'bg-secondary-sage-green');

  const handleCreateMember = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;

    try {
      setSaving(true);
      await api.post('/collab/users', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        phone: form.phone.trim(),
      });
      await loadUsers();
      setForm(initialForm);
      setModalOpen(false);
      toast.success('Member added successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (member) => {
    const confirmed = window.confirm(`Delete ${member?.name || 'this member'}?`);
    if (!confirmed) return;

    const memberId = String(member?._id || '');

    try {
      setSaving(true);
      await api.delete(`/collab/users/${memberId}`);
      setUsers((prev) => prev.filter((item) => String(item._id) !== memberId));
      toast.success('Member deleted');
    } catch (err) {
      if (err?.response?.status === 404) {
        setUsers((prev) => prev.filter((item) => String(item._id) !== memberId));
        toast.info('Member was already removed');
        return;
      }
      toast.error(err?.response?.data?.message || 'Failed to delete member');
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold text-accent-warm-grey">Team Members</h1>
          <p className="text-text-default">Manage your team and collaborate effectively.</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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

          {canManageMembers && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>
      </motion.div>

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMembers.map((member, index) => {
          const gradient = colorPalette[index % colorPalette.length];
          const isActive = member.isActive !== false;
          const isSelf = String(member._id) === String(authUser?._id || authUser?.id || '');

          return (
            <motion.div
              key={String(member._id)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-background-warm-off-white`}>
                      {initials(member.name)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${getStatusClass(isActive)}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-accent-warm-grey">{member.name}</h3>
                    <p className="text-sm text-text-default">{roleTitle[member.role] || 'Member'}</p>
                  </div>
                </div>

                {canManageMembers && !isSelf && (
                  <button
                    className="rounded-lg p-2 text-[#B04E3A] transition hover:bg-[#E07A5F]/10"
                    type="button"
                    onClick={() => handleDeleteMember(member)}
                    disabled={saving}
                    title="Delete member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
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
            <UserPlus className="h-3.5 w-3.5" />
            Add Member
          </div>
          <h2 className="text-xl font-semibold text-accent-warm-grey">Create Team Member</h2>
          <form onSubmit={handleCreateMember} className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Aman Verma"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="member@brindra.com"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-text-default">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Create password"
                  className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-medium text-text-default">Role</span>
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="team_leader">Team Leader</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Phone</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>

            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.email.trim() || !form.password.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
