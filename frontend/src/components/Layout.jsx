import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { isAuthenticated, authUser, userWorkspaces, selectedWorkspaceId, activeRole } = useAuth();

  return (
    <div className="flex min-h-screen relative">
      <div className="overlay" />
      {isAuthenticated && (
        <Sidebar 
          userName={authUser?.name}
          activeRole={activeRole}
          workspaceName={userWorkspaces.find((w) => w.workspaceId === selectedWorkspaceId)?.name}
        />
      )}
      
      <main className={`flex-1 bg-background-light-sand p-6 ${isAuthenticated ? 'ml-60' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          <Outlet />
          <Footer />
        </div>
      </main>
    </div>
  );
}
