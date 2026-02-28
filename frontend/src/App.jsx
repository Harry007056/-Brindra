import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TeamMembers from './pages/TeamMembers';
import Projects from './pages/Projects';
import Messages from './components/Messages';
import Files from './components/Files';
import Settings from './pages/Settings';

// activeView may be one of 'dashboard','team','projects','messages','files','settings'

export default function App() {
  // using simple string state, start on dashboard
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'team':
        return <TeamMembers />;
      case 'projects':
        return <Projects />;
      case 'messages':
        return <Messages />;
      case 'files':
        return <Files />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] flex">
      {/* Leaf Paper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 ml-20 lg:ml-72 p-8 lg:p-12 overflow-auto">
        <div className="w-full px-4 lg:px-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}