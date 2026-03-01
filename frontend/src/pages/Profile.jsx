import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, MapPin, Save, Shield, Users } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('Alex Kim');
  const [email, setEmail] = useState('alex@brindra.io');
  const [role, setRole] = useState('Product Lead');
  const [location, setLocation] = useState('San Francisco, CA');

  const activity = [
    { text: 'Logged in to workspace', time: '2 hours ago' },
    { text: 'Created project "Website Redesign"', time: 'Yesterday' },
    { text: 'Joined Team Design Ops', time: '3 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Profile</h1>
        <p className="text-text-default">Manage your personal details and team presence.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-dusty-blue text-2xl font-semibold text-background-warm-off-white">
                AK
              </div>
              <button className="absolute -bottom-1 -right-1 rounded-full bg-background-warm-off-white p-2 text-primary-dusty-blue shadow-sm ring-1 ring-[#88C0D0]/35">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-accent-warm-grey">{name}</h2>
            <p className="text-sm text-text-default">{role}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-text-default">
              <MapPin className="h-3.5 w-3.5 text-primary-dusty-blue" />
              {location}
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-accent-warm-grey">Profile Details</h3>
          <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-default">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-default">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-default">Role</span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-default">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </label>
            <div className="sm:col-span-2 pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-accent-warm-grey">Activity History</h3>
          <ul className="mt-3 space-y-2">
            {activity.map((act, i) => (
              <li key={i} className="rounded-xl bg-background-light-sand px-3 py-2">
                <p className="text-sm text-accent-warm-grey">{act.text}</p>
                <p className="text-xs text-text-default">{act.time}</p>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-accent-warm-grey">Security & Teams</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-background-light-sand p-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary-dusty-blue" />
                <div>
                  <p className="text-sm font-medium text-accent-warm-grey">Password</p>
                  <p className="text-xs text-text-default">Last changed 30 days ago</p>
                </div>
              </div>
              <button className="rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-1.5 text-xs font-medium text-primary-dusty-blue hover:bg-background-warm-off-white">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-background-light-sand p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-dusty-blue" />
                <div>
                  <p className="text-sm font-medium text-accent-warm-grey">Teams</p>
                  <p className="text-xs text-text-default">2 active teams</p>
                </div>
              </div>
              <button className="rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-1.5 text-xs font-medium text-primary-dusty-blue hover:bg-background-warm-off-white">
                Manage
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
