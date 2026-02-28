import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import KirigamiLogo from '../assets/kirigami-logo.svg';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = (
    <ul className="space-y-1">
      <li><Link to="/dashboard" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Dashboard</Link></li>
      <li><Link to="/projects" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Projects</Link></li>
      <li><Link to="/teams" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Teams</Link></li>
      <li><Link to="/chat" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Chat</Link></li>
      <li><Link to="/profile" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Profile</Link></li>
      <li><Link to="/settings" className="block px-4 py-3 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileOpen(false)}>Settings</Link></li>
      <li className="pt-3 mt-3 border-t border-gray-200"><button className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">Logout</button></li>
    </ul>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Elegant sidebar */}
      <nav className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static left-0 top-0 w-64 h-screen kirigami-card p-6 overflow-y-auto transition-transform duration-300 z-40 md:z-0`}>
        <div className="mb-6 relative">
          <div className="brand-badge">
            <img src={KirigamiLogo} alt="Brindra" className="logo" style={{height:48}} />
            <div>
              <h2 className="text-xl font-serif text-text font-bold">brindra</h2>
              <p className="text-xs text-gray-500 mt-0.5">Team Collaboration</p>
            </div>
          </div>
          <img src={KirigamiLogo} alt="organic" className="organic-bg" aria-hidden="true" />
        </div>
        {navItems}
      </nav>

      <div className="flex-1 flex flex-col w-full">
        {/* Elegant top header */}
        <header className="w-full bg-transparent border-b border-transparent px-8 py-4 flex items-center justify-between">
          <div className="flex items-center flex-1">
            <input
              type="text"
              placeholder="Search teams, projects..."
              className="soft-input w-80 text-sm focus:outline-none transition"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-primary transition text-lg" title="Notifications">
              🔔
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full cursor-pointer hover:shadow-lg transition" title="Profile" />
          </div>
        </header>

        {/* Mobile header */}
        <header className="md:hidden w-full bg-transparent border-b border-transparent px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-serif font-bold text-text">brindra</h1>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="text-text text-2xl hover:text-primary transition"
          >
            ☰
          </button>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}