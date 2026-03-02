import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import api, { clearAuthTokens, getAccessToken, getRefreshToken } from './api';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const TeamMembers = lazy(() => import('./pages/TeamMembers'));
const Projects = lazy(() => import('./pages/Projects'));
const Messages = lazy(() => import('./components/Messages'));
const Files = lazy(() => import('./components/Files'));
const Settings = lazy(() => import('./pages/Settings'));
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Chat = lazy(() => import('./pages/Chat'));
const Teams = lazy(() => import('./pages/Teams'));

const pageRegistry = {
  dashboard: { label: 'Dashboard', component: Dashboard, protected: true, group: 'primary' },
  team: { label: 'Team', component: TeamMembers, protected: true, group: 'primary' },
  projects: { label: 'Projects', component: Projects, protected: true, group: 'primary' },
  messages: { label: 'Messages', component: Messages, protected: true, group: 'primary' },
  files: { label: 'Files', component: Files, protected: true, group: 'primary' },
  settings: { label: 'Settings', component: Settings, protected: true, group: 'primary', roles: ['team_leader', 'manager'] },
  home: { label: 'Home', component: Home, protected: false, group: 'extra' },
  features: { label: 'Features', component: Features, protected: false, group: 'extra' },
  pricing: { label: 'Pricing', component: Pricing, protected: false, group: 'extra' },
  aboutus: { label: 'About Us', component: AboutUs, protected: false, group: 'extra' },
  landing: { label: 'Landing', component: Landing, protected: false, group: 'extra' },
  profile: { label: 'Profile', component: Profile, protected: true, group: 'extra' },
  'project-details': { label: 'Project Details', component: ProjectDetails, protected: true, group: 'extra' },
  chat: { label: 'Chat', component: Chat, protected: true, group: 'extra' },
  teams: { label: 'Teams', component: Teams, protected: true, group: 'extra' },
  login: { label: 'Login', protected: false, group: 'extra' },
  register: { label: 'Register', protected: false, group: 'extra' },
};

const THEME_STORAGE_KEY = 'brindra-theme';

const resolveInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));
  const [activeView, setActiveView] = useState(() => (getAccessToken() ? 'dashboard' : 'landing'));
  const [sessionLoading, setSessionLoading] = useState(() => Boolean(getAccessToken()));
  const [authUser, setAuthUser] = useState(null);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(() => localStorage.getItem('activeWorkspaceId') || '');
  const [activeRole, setActiveRole] = useState(null);
  const [theme, setTheme] = useState(resolveInitialTheme);

  const visibleExtraViews = useMemo(
    () =>
      Object.entries(pageRegistry).filter(
        ([, page]) => isAuthenticated && page.group === 'extra' && page.protected
      ),
    [isAuthenticated]
  );

  const hydrateSession = useCallback(async () => {
    if (!getAccessToken()) {
      setSessionLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data?.user || null;
      const workspaces = Array.isArray(response.data?.workspaces) ? response.data.workspaces : [];
      const defaultWorkspace =
        workspaces.find((workspace) => String(workspace.workspaceId) === String(localStorage.getItem('activeWorkspaceId'))) ||
        workspaces[0] ||
        null;

      if (defaultWorkspace?.workspaceId) {
        localStorage.setItem('activeWorkspaceId', String(defaultWorkspace.workspaceId));
        setSelectedWorkspaceId(String(defaultWorkspace.workspaceId));
        setActiveRole(defaultWorkspace.role || null);
      } else {
        localStorage.removeItem('activeWorkspaceId');
        setSelectedWorkspaceId('');
        setActiveRole(null);
      }

      setAuthUser(user);
      setUserWorkspaces(workspaces);
      setIsAuthenticated(true);
    } catch {
      clearAuthTokens();
      localStorage.removeItem('activeWorkspaceId');
      setAuthUser(null);
      setUserWorkspaces([]);
      setSelectedWorkspaceId('');
      setActiveRole(null);
      setIsAuthenticated(false);
      setActiveView('landing');
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
    await hydrateSession();
  };

  const handleRegisterSuccess = async () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
    await hydrateSession();
  };

  const goToLogin = () => setActiveView('login');
  const goToRegister = () => setActiveView('register');
  const goToPublicPage = (viewId) => setActiveView(viewId);

  const handleWorkspaceChange = (workspaceId) => {
    localStorage.setItem('activeWorkspaceId', workspaceId);
    setSelectedWorkspaceId(workspaceId);
    const activeMembership = userWorkspaces.find((workspace) => String(workspace.workspaceId) === String(workspaceId));
    setActiveRole(activeMembership?.role || null);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {
        refreshToken: getRefreshToken(),
      });
    } catch {
      // logout should clear local session even if server revoke call fails
    }

    clearAuthTokens();
    localStorage.removeItem('activeWorkspaceId');
    setAuthUser(null);
    setUserWorkspaces([]);
    setSelectedWorkspaceId('');
    setActiveRole(null);
    setIsAuthenticated(false);
    setActiveView('landing');
  };

  const renderActiveView = () => {
    if (activeView === 'login') {
      return (
        <MemoryRouter>
          <Login onLoginSuccess={handleLoginSuccess} onRegisterClick={goToRegister} setActiveView={setActiveView} />
        </MemoryRouter>
      );
    }

    if (activeView === 'register') {
      return (
        <MemoryRouter>
          <Register onRegisterSuccess={handleRegisterSuccess} onLoginClick={goToLogin} setActiveView={setActiveView} />
        </MemoryRouter>
      );
    }

    const page = pageRegistry[activeView];
    if (!page) return <Landing onLoginClick={goToLogin} onRegisterClick={goToRegister} onNavigate={goToPublicPage} />;

    if (page.protected && !isAuthenticated) {
      return <Landing onLoginClick={goToLogin} onRegisterClick={goToRegister} onNavigate={goToPublicPage} />;
    }

    const ActiveComponent = page.component;
    if (!ActiveComponent) {
      return <Landing onLoginClick={goToLogin} onRegisterClick={goToRegister} onNavigate={goToPublicPage} />;
    }

    if (page.roles && !page.roles.includes(activeRole)) {
      return (
        <div className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-accent-warm-grey">Restricted Page</h2>
          <p className="mt-2 text-sm text-text-default">
            Your role <span className="font-semibold">{activeRole || 'member'}</span> does not have access to this page.
          </p>
        </div>
      );
    }

    if (activeView === 'landing') {
      return <Landing onLoginClick={goToLogin} onRegisterClick={goToRegister} onNavigate={goToPublicPage} />;
    }

    if (activeView === 'home') {
      return <Home onRegisterClick={goToRegister} setActiveView={setActiveView} />;
    }

    return <ActiveComponent setActiveView={setActiveView} userName={authUser?.name} authUser={authUser} />;
  };

  const pageLoadingState = (
    <div className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 text-sm text-text-default shadow-sm">
      Loading...
    </div>
  );

  return (
    <div className="flex min-h-screen relative">
      <div className="overlay" />
      {isAuthenticated && (
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userName={authUser?.name}
          activeRole={activeRole}
          workspaceName={userWorkspaces.find((workspace) => String(workspace.workspaceId) === String(selectedWorkspaceId))?.name}
        />
      )}
      
      <main className={`flex-1 bg-background-light-sand p-6 ${isAuthenticated ? 'ml-60' : ''}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          {isAuthenticated && (
            <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-default">More Pages</span>
                {visibleExtraViews.map(([id, page]) => (
                  <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      activeView === id
                        ? 'bg-primary-dusty-blue text-background-warm-off-white'
                        : 'bg-background-light-sand text-primary-dusty-blue hover:bg-primary-soft-sky/20'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
                {activeView !== 'dashboard' && (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="rounded-full bg-primary-dusty-blue px-3 py-1.5 text-xs font-medium text-background-warm-off-white hover:bg-primary-soft-sky"
                  >
                    Back to Dashboard
                  </button>
                )}
                {userWorkspaces.length > 0 && (
                  <select
                    value={selectedWorkspaceId}
                    onChange={(event) => handleWorkspaceChange(event.target.value)}
                    className="rounded-full border border-[#88C0D0]/35 bg-background-light-sand px-3 py-1.5 text-xs font-medium text-primary-dusty-blue outline-none"
                  >
                    {userWorkspaces.map((workspace) => (
                      <option key={String(workspace.workspaceId)} value={String(workspace.workspaceId)}>
                        {workspace.name} ({workspace.role})
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-accent-muted-coral/15 px-3 py-1.5 text-xs font-medium text-accent-muted-coral hover:bg-accent-muted-coral/25"
                >
                  Logout
                </button>
                <button
                  onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                  className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#88C0D0]/35 bg-background-light-sand px-3 py-1.5 text-xs font-medium text-primary-dusty-blue shadow-sm transition hover:bg-background-warm-off-white"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </section>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Suspense fallback={pageLoadingState}>
                {sessionLoading ? pageLoadingState : renderActiveView()}
              </Suspense>
            </motion.div>
          </AnimatePresence>

          <Footer />
        </div>
      </main>
    </div>
  );
}

