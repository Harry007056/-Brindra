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
  const [generatePassword, setGeneratePassword] = useState(true);
  const [validation, setValidation] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    workspaceName: 'Team Workspace',
    password: '',
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

    const nameError = validateName(newMember.name);
    const emailError = validateEmail(newMember.email);
    const phoneError = validatePhone(newMember.phone);

    setValidation({ name: nameError, email: emailError, phone: phoneError });

    if (nameError || emailError || phoneError) {
      return;
    }

    setCreating(true);
    try {
      const password = generatePassword ? makePassword() : newMember.password.trim();
      if (!password) {
        setError('Password is required when manual entry is enabled');
        setCreating(false);
        return;
      }

      const response = await api.post('/auth/register', {
        name: newMember.name.trim(),
        email: newMember.email.trim(),
        phone: newMember.phone.trim(),
        role: newMember.role,
        workspaceName: newMember.workspaceName.trim(),
        password,
      });

      setUsers((prev) => [...prev, response.data.user]);
      setModalOpen(false);
      setGeneratePassword(true);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: 'member',
        workspaceName: 'Team Workspace',
        password: '',
      });
      setValidation({ name: '', email: '', phone: '' });
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

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Enter a valid email address';
  };

  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    return '';
  };

  const validatePhone = (value) => {
    if (!value) return '';
    const phoneRegex = /^[0-9()+\s-]{7,20}$/;
    return phoneRegex.test(value) ? '' : 'Please enter a valid phone number';
  };

  const handleFieldChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
    setValidation((prev) => {
      if (field === 'email') return { ...prev, email: validateEmail(value) };
      if (field === 'name') return { ...prev, name: validateName(value) };
      if (field === 'phone') return { ...prev, phone: validatePhone(value) };
      return prev;
    });
  };

  const makePassword = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID().slice(0, 12);
    }
    return `${Math.random().toString(36).slice(-9)}A1!`;
  };

  const inputClasses = (hasError) =>
    `w-full rounded-2xl border px-3 py-2.5 text-sm text-slate-100 bg-slate-950/95 outline-none transition duration-150 ease-out placeholder:text-slate-500 ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
        : 'border-slate-700 focus:border-primary-soft-sky focus:ring-primary-soft-sky/25 hover:border-slate-500'
    }`;

  const labelClasses = 'block text-xs font-semibold uppercase tracking-wide text-slate-300';

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
              <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${gradient}`} />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`grid h-11 w-11 place-items-center rounded-full bg-linear-to-br ${gradient} text-sm font-semibold text-background-warm-off-white`}>
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
        <div className="flex h-full flex-col space-y-5 px-6 pb-4 pt-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              <Users className="h-3.5 w-3.5" />
              Add Team Member
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">Invite New Member</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                Invite a teammate with a secure, guided form. The password is generated automatically unless you want to type one manually.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateMember} className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className={labelClasses}>Full Name</span>
                  <input
                    value={newMember.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="John Doe"
                    className={inputClasses(Boolean(validation.name))}
                  />
                  {validation.name && <p className="text-xs text-red-400">{validation.name}</p>}
                </label>

                <label className="space-y-2">
                  <span className={labelClasses}>Email Address</span>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={inputClasses(Boolean(validation.email))}
                  />
                  {validation.email && <p className="text-xs text-red-400">{validation.email}</p>}
                </label>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClasses}>Phone Number</span>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClasses(Boolean(validation.phone))}
                    />
                    {validation.phone && <p className="text-xs text-red-400">{validation.phone}</p>}
                  </label>

                  <label className="space-y-2">
                    <span className={labelClasses}>Role</span>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, role: e.target.value }))}
                      className={inputClasses(false)}
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      <option value="team_leader">Team Leader</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Generate Random Password</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Let the system generate a secure password automatically.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGeneratePassword((prev) => !prev)}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${
                        generatePassword ? 'bg-sky-400/90' : 'bg-slate-700/90'
                      }`}
                      aria-pressed={generatePassword}
                    >
                      <span
                        className={`inline-block h-6 w-6 rounded-full bg-slate-950 shadow-lg transition-transform ${
                          generatePassword ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {!generatePassword && (
                  <label className="space-y-2">
                    <span className={labelClasses}>Password</span>
                    <input
                      type="password"
                      value={newMember.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      placeholder="Create a password"
                      className={inputClasses(false)}
                    />
                    <p className="text-xs text-slate-500">Use a strong password for this member account.</p>
                  </label>
                )}

                <label className="space-y-2">
                  <span className={labelClasses}>Workspace</span>
                  <input
                    value={newMember.workspaceName}
                    onChange={(e) => setNewMember((prev) => ({ ...prev, workspaceName: e.target.value }))}
                    placeholder="Team Workspace"
                    className={inputClasses(false)}
                  />
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 left-0 z-10 mt-4 border-t border-slate-800 bg-slate-950/95 pt-4">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {creating ? 'Creating...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
