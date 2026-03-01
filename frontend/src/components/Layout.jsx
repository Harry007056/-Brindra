import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Bell,
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
  Compass,
  Command,
} from 'lucide-react';
import KirigamiLogo from '../assets/kirigami-logo.svg';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarNav({ onNavigate }) {
  return (
    <ul className="space-y-1.5">
      {navLinks.map((item, idx) => {
        const Icon = item.icon;
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#EAF5FA] transition hover:border-[#D9E1D7] hover:bg-background-light-sand/50 hover:text-background-warm-off-white"
            >
              <span className="absolute inset-y-0 left-0 w-0.5 bg-[#D7ECF4] opacity-0 transition group-hover:opacity-100" />
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-background-light-sand/45 text-[#D8EBF3] transition group-hover:bg-background-light-sand/60 group-hover:text-background-warm-off-white">
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-[#BFDCE7] opacity-0 transition group-hover:opacity-100">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </Link>
          </li>
        );
      })}

      <li className="pt-2">
        <button className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left text-sm font-medium text-[#EAF5FA] transition hover:border-[#D9E1D7] hover:bg-background-light-sand/50 hover:text-background-warm-off-white">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-background-light-sand/45 text-[#D8EBF3] transition group-hover:bg-background-light-sand/60 group-hover:text-background-warm-off-white">
            <LogOut className="h-4 w-4" />
          </div>
          Logout
        </button>
      </li>
    </ul>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-light-sand">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(136,192,208,0.16),transparent_38%),radial-gradient(circle_at_90%_5%,rgba(163,190,140,0.18),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(94,129,172,0.14),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 bg-center bg-cover opacity-5" style={{ backgroundImage: "url('/leaf-pattern.svg')" }} />

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 overflow-hidden border-r border-[#88C0D0]/25 bg-gradient-to-b from-[#5E81AC] via-[#4F749D] to-[#3D5F86] p-6 text-background-warm-off-white shadow-[0_20px_50px_rgba(43,60,82,0.35)] lg:block">
        <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-background-light-sand/45 blur-2xl" />
        <div className="pointer-events-none absolute -left-14 bottom-10 h-44 w-44 rounded-full bg-[#A3BE8C]/20 blur-2xl" />

        <div className="relative mb-9 flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-background-light-sand/50 ring-1 ring-[#D9E1D7]">
            <img src={KirigamiLogo} alt="Brindra" className="h-7 w-7 object-contain" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#A3BE8C] text-[#4C566A]">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Brindra</h2>
            <p className="text-xs uppercase tracking-[0.16em] text-[#D7ECF4]">Team Collaboration</p>
          </div>
        </div>

        <SidebarNav onNavigate={undefined} />

        <div className="relative mt-6 rounded-2xl border border-[#D9E1D7] bg-background-light-sand/45 p-3 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#D7ECF4]">Workspace Pulse</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-background-warm-off-white">Focus Mode</span>
            <span className="rounded-full bg-[#A3BE8C] px-2 py-0.5 text-[10px] font-semibold text-[#4C566A]">Active</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background-light-sand/60">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#A3BE8C] to-[#88C0D0]" />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#4C566A]/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="relative h-full w-80 overflow-hidden border-r border-[#88C0D0]/25 bg-gradient-to-b from-[#5E81AC] via-[#4F749D] to-[#3D5F86] p-6 text-background-warm-off-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={KirigamiLogo} alt="Brindra" className="h-8 w-8 rounded-xl bg-background-light-sand/55 p-1 ring-1 ring-[#D9E1D7]" />
                <h2 className="text-lg font-bold">Brindra</h2>
              </div>
              <button className="rounded-lg p-2 text-[#EAF5FA] hover:bg-background-light-sand/55" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="relative lg:ml-72">
        <header className="sticky top-0 z-10 border-b border-[#D9E1D7] bg-background-light-sand/70 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2 text-primary-dusty-blue shadow-sm lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="relative hidden sm:block sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
                <input
                  type="text"
                  placeholder="Search teams, projects..."
                  className="w-full rounded-2xl border border-[#88C0D0]/35 bg-background-warm-off-white/90 py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none shadow-sm transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-xs font-medium text-primary-dusty-blue shadow-sm hover:bg-background-warm-off-white">
                <Command className="h-3.5 w-3.5" />
                Quick
              </button>
              <button className="rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2 text-primary-dusty-blue shadow-sm hover:bg-background-warm-off-white">
                <Compass className="h-4 w-4" />
              </button>
              <button className="rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-2 text-primary-dusty-blue shadow-sm hover:bg-background-warm-off-white">
                <Bell className="h-4 w-4" />
              </button>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#5E81AC] to-[#88C0D0] text-xs font-semibold text-background-warm-off-white shadow-sm">
                AK
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-[#D9E1D7] bg-background-warm-off-white/75 p-4 shadow-[0_10px_30px_rgba(43,60,82,0.08)] backdrop-blur-sm lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
