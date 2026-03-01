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
import { clsx } from 'clsx';

// valid view strings for navigation
// @typedef {'dashboard'|'team'|'projects'|'messages'|'files'|'settings'} View

// Sidebar props: { activeView, setActiveView }
// @param {{activeView: View, setActiveView: (view: View)=>void}} props

// navigation items for sidebar
// each item has {id, label, icon}
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: FileBox },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-gradient-to-b from-[#F8F9F6] to-[#F1F3EE] border-r border-[#E0DDD4]/50 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5b8def] to-[#3d7bd4] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-[#4C566A] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Brindra
          </h1>
          <p className="text-xs text-[#5b8def]">Team Collaboration</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-[#E0DDD4]/50 to-transparent text-[#4C566A]'
                  : 'text-[#8B8E7E] hover:text-[#4C566A] hover:bg-[#E0DDD4]/30'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-[#5E81AC]/10 to-transparent rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={clsx(
                'w-5 h-5 transition-colors relative z-10',
                isActive ? 'text-[#5b8def]' : 'group-hover:text-[#5b8def]'
              )} />
              <span className="hidden lg:block font-medium relative z-10" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#E0DDD4]/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E0DDD4]/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] flex items-center justify-center text-white font-semibold text-sm">
            AK
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-[#4C566A]">Alex Kim</p>
            <p className="text-xs text-[#8B8E7E]">Product Lead</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}