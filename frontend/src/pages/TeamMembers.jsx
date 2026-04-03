import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, MoreVertical, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
                <button className="rounded-lg p-1.5 text-text-default transition hover:bg-background-light-sand hover:text-accent-warm-grey" type="button">
                  <MoreVertical className="h-4 w-4" />
                </button>
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
    </div>
  );
}
