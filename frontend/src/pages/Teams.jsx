import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

const members = [
  { name: 'Alice', role: 'Designer', online: true },
  { name: 'Bob', role: 'Developer', online: false },
  { name: 'Carlos', role: 'Product Manager', online: true },
  { name: 'Diana', role: 'Developer', online: true },
];

const filters = ['All Members', 'Designers', 'Developers', 'Product'];

export default function Teams() {
  const [modalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Members');
  const [search, setSearch] = useState('');
  const [teams] = useState([]);

  const visibleMembers = useMemo(() => {
    const filteredByRole = members.filter((member) => {
      if (activeFilter === 'All Members') return true;
      if (activeFilter === 'Designers') return member.role === 'Designer';
      if (activeFilter === 'Developers') return member.role === 'Developer';
      return member.role === 'Product Manager';
    });

    return filteredByRole.filter((member) => member.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeFilter, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    console.log('create team', teamName);
    setModalOpen(false);
    setTeamName('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-warm-grey">Teams</h1>
          <p className="text-text-default">Organize members and collaborate in focused team spaces.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
        >
          <Plus className="h-4 w-4" />
          New Team
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <motion.aside
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-default">Filters</h2>
          <ul className="mt-3 space-y-1">
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  onClick={() => setActiveFilter(filter)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                    activeFilter === filter
                      ? 'bg-primary-soft-sky/25 text-[#4C566A] ring-1 ring-primary-soft-sky/40'
                      : 'text-accent-warm-grey hover:bg-background-light-sand'
                  }`}
                >
                  {filter}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl bg-background-light-sand p-3 text-xs text-text-default">
            <p className="font-medium text-accent-warm-grey">Team Spaces</p>
            <p className="mt-1">{teams.length} custom teams created</p>
          </div>
        </motion.aside>

        <motion.section
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-accent-warm-grey">Team Members</h2>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
          </div>

          {visibleMembers.length === 0 ? (
            <EmptyState message="No team members match the selected filter." />
          ) : (
            <div className="space-y-2">
              {visibleMembers.map((member, idx) => (
                <div key={member.name + idx} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background-light-sand p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-dusty-blue text-sm font-semibold text-background-warm-off-white">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-accent-warm-grey">{member.name}</p>
                      <p className="text-xs text-text-default">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${member.online ? 'bg-secondary-sage-green' : 'bg-slate-300'}`} />
                    <button className="rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-1.5 text-xs font-medium text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-dusty-blue text-background-warm-off-white shadow-lg transition hover:bg-primary-soft-sky"
      >
        <Plus className="h-5 w-5" />
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft-sky/20 px-3 py-1 text-xs font-medium text-primary-dusty-blue">
            <Users className="h-3.5 w-3.5" />
            New Team
          </div>
          <h2 className="text-xl font-semibold text-accent-warm-grey">Create Team</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Team Name</span>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Design Ops"
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
