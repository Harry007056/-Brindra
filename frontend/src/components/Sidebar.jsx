import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  FileBox,
  Settings,
  Leaf
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: FileBox },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function getInitials(name = 'User') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function Sidebar({ activeView, setActiveView, userName, activeRole, workspaceName, allowedViews }) {
  const initials = getInitials(userName || 'User');
  const roleLabel = activeRole
    ? activeRole
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Member';

  const visibleNavItems = Array.isArray(allowedViews) && allowedViews.length
    ? navItems.filter((item) => allowedViews.includes(item.id))
    : navItems;

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-20 w-60 flex-shrink-0 overflow-auto border-r border-[#88C0D0]/25 bg-gradient-to-b from-[#5E81AC] via-[#5A7BA4] to-[#4C6A90] p-6 text-background-warm-off-white shadow-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-background-light-sand/55 ring-1 ring-[#D9E1D7]">
          <Leaf className="h-5 w-5 text-[#DFF4FA]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brindra</h1>
          <p className="text-xs text-[#D7ECF4]">Team Collaboration</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#88C0D0] text-[#4C566A] shadow-md'
                  : 'text-[#EAF5FA] hover:bg-background-light-sand/50 hover:text-background-warm-off-white'
              }`}
              onClick={() => setActiveView(item.id)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  isActive ? 'bg-[#4C566A]' : 'bg-[#BFDCE7] group-hover:bg-background-warm-off-white'
                }`}
              />
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#4C566A]' : 'text-[#D8EBF3] group-hover:text-background-warm-off-white'}`} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex items-center space-x-3 rounded-xl border border-[#D9E1D7] bg-background-light-sand/45 p-3 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A3BE8C] font-semibold text-[#4C566A]">{initials}</div>
          <div className="text-sm">
            <p className="font-medium text-[#F6FCFF]">{userName || 'Brindra User'}</p>
            <p className="text-xs text-[#D7ECF4]">{workspaceName || 'Workspace'} - {roleLabel}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
