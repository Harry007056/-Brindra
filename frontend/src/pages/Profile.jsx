import { useState } from 'react';

export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');

  const activity = [
    'Logged in',
    'Created Project Alpha',
    'Joined Team A',
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[#F8F9F6] rounded-lg p-6 shadow max-w-lg mx-auto border border-[#E0DDD4]/50">
        <h2 className="text-2xl font-semibold mb-4 text-[#4C566A]">Profile</h2>
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] rounded-full flex items-center justify-center text-4xl text-white">
            JD
          </div>
          <div className="ml-4">
            <p className="text-sm text-[#8B8E7E]">Change photo</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4C566A]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-[#E0DDD4]/50 rounded-md p-2 text-[#4C566A] focus:border-[#5E81AC]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4C566A]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-[#E0DDD4]/50 rounded-md p-2 text-[#4C566A] focus:border-[#5E81AC]"
            />
          </div>
          <button className="py-2 px-4 bg-[#5E81AC] text-white rounded-lg hover:bg-[#88C0D0] transition">
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-[#F8F9F6] rounded-lg p-6 shadow max-w-lg mx-auto border border-[#E0DDD4]/50">
        <h3 className="text-xl font-semibold mb-3 text-[#4C566A]">Activity History</h3>
        <ul className="space-y-2">
          {activity.map((act, i) => (
            <li key={i} className="text-[#8B8E7E]">{act}</li>
          ))}
        </ul>
      </div>

      <div className="bg-[#F8F9F6] rounded-lg p-6 shadow max-w-lg mx-auto border border-[#E0DDD4]/50">
        <h3 className="text-xl font-semibold mb-3 text-[#4C566A]">Security & Teams</h3>
        <p className="text-[#8B8E7E]">Password change and team information would go here.</p>
      </div>
    </div>
  );
}