import { useState } from 'react';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function Teams() {
  const [modalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teams] = useState([]);

  const handleCreate = (e) => {
    e.preventDefault();
    // TODO: POST /api/Team
    console.log('create team', teamName);
    setModalOpen(false);
  };

  const members = [
    { name: 'Alice', role: 'Designer', online: true },
    { name: 'Bob', role: 'Developer', online: false },
    { name: 'Carlos', role: 'Product Manager', online: true },
  ];

  return (
    <div className="flex p-6">
      <aside className="w-48 pr-6">
        <h2 className="font-semibold mb-2 text-[#4C566A]">Filters</h2>
        <ul className="space-y-2">
          <li><button className="text-[#5b8def] hover:underline">All Members</button></li>
          <li><button className="text-[#5b8def] hover:underline">Designers</button></li>
          <li><button className="text-[#5b8def] hover:underline">Developers</button></li>
        </ul>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#4C566A]">Team Members</h1>
          <button
            className="py-1 px-3 bg-[#4ade80] text-[#4C566A] rounded hover:bg-[#5b8def] transition"
            onClick={() => setModalOpen(true)}
          >
            + New Team
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m, idx) => (
            <div key={idx} className="bg-[#F8F9F6] backdrop-blur rounded-lg p-4 shadow flex items-center space-x-4 border border-[#E0DDD4]/50">
              <div className="w-12 h-12 bg-[#E0DDD4]/30 rounded-full flex items-center justify-center text-xl text-[#4C566A]">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#4C566A]">{m.name}</p>
                <p className="text-sm text-[#a8a29e]">{m.role}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${m.online ? 'bg-[#A3BE8C]' : 'bg-[#8B8E7E]'}`} />
              <button className="text-[#5b8def] hover:underline">Message</button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 bg-[#5b8def] text-white p-4 rounded-full shadow-lg hover:bg-[#3d7bd4] transition"
        onClick={() => setModalOpen(true)}
      >
        +
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4 text-[#4C566A]">Create Team</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4C566A]">Team Name</label>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 block w-full border border-[#E0DDD4]/50 rounded-md p-2 text-[#4C566A] focus:border-[#5b8def]"
            />
          </div>
          <button type="submit" className="py-2 px-4 bg-[#5b8def] text-white rounded-lg hover:bg-[#3d7bd4] transition">
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
}