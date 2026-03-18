import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FolderKanban, MessageSquare, FileBox, Settings, LayoutList, BarChart3, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Team', path: '/team', icon: Users },
  { id: 'projects', label: 'Projects', path: '/projects', icon: FolderKanban },
  { id: 'messages', label: 'Messages', path: '/messages', icon: MessageSquare },
  { id: 'files', label: 'Files', path: '/files', icon: FileBox },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  { id: 'tasks', label: 'Tasks', path: '/tasks', icon: LayoutList },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell },
];

function getInitials(name = 'User') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function Sidebar({ userName, activeRole, workspaceName, allowedViews = [] }) {
  const initials = getInitials(userName);
  const roleLabel = activeRole
    ? activeRole.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'Member';
  const location = useLocation();
  const visibleNavItems = allowedViews.length ? navItems.filter(item => allowedViews.includes(item.id)) : navItems;

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-20 w-60 flex-shrink-0 overflow-auto border-r border-[#88C0D0]/25 p-6 text-background-warm-off-white shadow-xl"
      style={{ background: 'linear-gradient(180deg, var(--brand-primary) 0%, var(--brand-deep) 55%, var(--brand-deeper) 100%)' }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-background-light-sand/55 ring-1 ring-[#D9E1D7]">
          <svg className="h-5 w-5 text-[#DFF4FA]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brindra</h1>
          <p className="text-xs text-[#D7ECF4]">Team Collaboration</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-soft-sky text-[#4C566A] shadow-md border border-[#D9E1D7]'
                  : 'text-[#EAF5FA] hover:bg-background-light-sand/50 hover:text-background-warm-off-white hover:border-[#D9E1D7]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  isActive ? 'bg-[#4C566A]' : 'bg-[#BFDCE7] group-hover:bg-background-warm-off-white'
                }`}
              />
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#4C566A]' : 'text-[#D8EBF3] group-hover:text-background-warm-off-white'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex items-center space-x-3 rounded-xl border border-[#D9E1D7] bg-background-light-sand/45 p-3 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft-sky font-semibold text-[#4C566A]">
            {initials}
          </div>
          <div className="text-sm">
            <p className="font-medium text-[#F6FCFF]">{userName || 'Brindra User'}</p>
            <p className="text-xs text-[#D7ECF4]">{workspaceName || 'Workspace'} - {roleLabel}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
