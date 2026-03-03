import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import api, { clearAuthTokens, getAccessToken, getActiveSessionId, getRefreshToken } from './api';

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
const ACCENT_STORAGE_KEY = 'brindra-accent-color';
const WORKSPACE_KEY_PREFIX = 'activeWorkspaceId:';
const PLAN_KEY_PREFIX = 'selectedPlan:';
const PLAN_ORDER = ['demo', 'starter', 'growth', 'enterprise'];
const PLAN_ALLOWED_VIEWS = {
  demo: new Set(['dashboard', 'projects']),
  starter: new Set(['dashboard', 'projects', 'team', 'messages']),
  growth: new Set(['dashboard', 'projects', 'team', 'messages', 'files', 'chat', 'teams']),
  enterprise: new Set(['dashboard', 'projects', 'team', 'messages', 'files', 'chat', 'teams', 'settings', 'profile', 'project-details']),
};

const getWorkspaceStorageKey = () => `${WORKSPACE_KEY_PREFIX}${getActiveSessionId() || 'guest'}`;
const getPlanStorageKey = () => `${PLAN_KEY_PREFIX}${getActiveSessionId() || 'guest'}`;

const getStoredWorkspaceId = () => localStorage.getItem(getWorkspaceStorageKey()) || '';

const setStoredWorkspaceId = (workspaceId) => {
  if (!workspaceId) return;
  localStorage.setItem(getWorkspaceStorageKey(), workspaceId);
};

const clearStoredWorkspaceId = () => {
  localStorage.removeItem(getWorkspaceStorageKey());
};

const getStoredPlan = () => {
  const stored = localStorage.getItem(getPlanStorageKey()) || '';
  if (PLAN_ORDER.includes(stored)) return stored;
  const guestStored = localStorage.getItem(`${PLAN_KEY_PREFIX}guest`) || '';
  return PLAN_ORDER.includes(guestStored) ? guestStored : 'demo';
};

const setStoredPlan = (planId) => {
  if (!PLAN_ORDER.includes(planId)) return;
  localStorage.setItem(getPlanStorageKey(), planId);
};

const clearStoredPlan = () => {
  localStorage.removeItem(getPlanStorageKey());
};

const resolveInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveInitialAccent = () => {
  if (typeof window === 'undefined') return '#5E81AC';
  return localStorage.getItem(ACCENT_STORAGE_KEY) || '#5E81AC';
};

const hexToRgb = (hex) => {
  const value = String(hex || '').replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((part) => Math.max(0, Math.min(255, Math.round(part))).toString(16).padStart(2, '0'))
    .join('')}`;

const lightenHex = (hex, amount = 0.35) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#88C0D0';
  return rgbToHex({
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount,
  });
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));
  const [activeView, setActiveView] = useState(() => (getAccessToken() ? 'dashboard' : 'landing'));
  const [sessionLoading, setSessionLoading] = useState(() => Boolean(getAccessToken()));
  const [authUser, setAuthUser] = useState(null);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(() => getStoredWorkspaceId());
  const [activeRole, setActiveRole] = useState(null);
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [accentColor, setAccentColor] = useState(resolveInitialAccent);
  const [activePlan, setActivePlan] = useState(getStoredPlan);

  const isViewAllowedByPlan = useCallback(
    (viewId) => {
      if (!isAuthenticated) return true;
      const allowed = PLAN_ALLOWED_VIEWS[activePlan] || PLAN_ALLOWED_VIEWS.demo;
      return allowed.has(viewId);
    },
    [activePlan, isAuthenticated]
  );

  const visibleExtraViews = useMemo(
    () =>
      Object.entries(pageRegistry).filter(
        ([id, page]) => isAuthenticated && page.group === 'extra' && page.protected && isViewAllowedByPlan(id)
      ),
    [isAuthenticated, isViewAllowedByPlan]
  );

  const allowedSidebarViews = useMemo(() => {
    const baseViews = ['dashboard', 'team', 'projects', 'messages', 'files', 'settings'];
    return baseViews.filter((viewId) => isViewAllowedByPlan(viewId));
  }, [isViewAllowedByPlan]);

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
        workspaces.find((workspace) => String(workspace.workspaceId) === String(getStoredWorkspaceId())) ||
        workspaces[0] ||
        null;

      if (defaultWorkspace?.workspaceId) {
        setStoredWorkspaceId(String(defaultWorkspace.workspaceId));
        setSelectedWorkspaceId(String(defaultWorkspace.workspaceId));
        setActiveRole(defaultWorkspace.role || null);
      } else {
        clearStoredWorkspaceId();
        setSelectedWorkspaceId('');
        setActiveRole(null);
      }

      setAuthUser(user);
      setUserWorkspaces(workspaces);
      setIsAuthenticated(true);
      setActivePlan(getStoredPlan());
    } catch {
      clearStoredWorkspaceId();
      clearStoredPlan();
      clearAuthTokens();
      setAuthUser(null);
      setUserWorkspaces([]);
      setSelectedWorkspaceId('');
      setActiveRole(null);
      setActivePlan('demo');
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

  useEffect(() => {
    const root = document.documentElement;
    const safeAccent = hexToRgb(accentColor) ? accentColor : '#5E81AC';
    const softAccent = lightenHex(safeAccent, 0.35);
    root.style.setProperty('--brand-primary', safeAccent);
    root.style.setProperty('--brand-soft', softAccent);
    localStorage.setItem(ACCENT_STORAGE_KEY, safeAccent);
  }, [accentColor]);

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
    await hydrateSession();
  };

  const handleRegisterSuccess = async () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
    setStoredPlan(getStoredPlan());
    await hydrateSession();
  };

  const goToLogin = () => setActiveView('login');
  const goToRegister = () => setActiveView('register');
  const goToPublicPage = (viewId) => setActiveView(viewId);

  const handlePlanSelect = (planId) => {
    if (!PLAN_ORDER.includes(planId)) return;
    setStoredPlan(planId);
    setActivePlan(planId);
  };

  const handleWorkspaceChange = (workspaceId) => {
    setStoredWorkspaceId(workspaceId);
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

    clearStoredWorkspaceId();
    clearStoredPlan();
    clearAuthTokens();
    setAuthUser(null);
    setUserWorkspaces([]);
    setSelectedWorkspaceId('');
    setActiveRole(null);
    setActivePlan('demo');
    setIsAuthenticated(false);
    setActiveView('landing');
  };

  const renderActiveView = () => {
    if (activeView === 'login') {
      return (
        <Login onLoginSuccess={handleLoginSuccess} onRegisterClick={goToRegister} setActiveView={setActiveView} />
      );
    }

    if (activeView === 'register') {
      return (
        <Register onRegisterSuccess={handleRegisterSuccess} onLoginClick={goToLogin} setActiveView={setActiveView} />
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

    if (page.protected && !isViewAllowedByPlan(activeView)) {
      return (
        <div className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-accent-warm-grey">Plan Upgrade Required</h2>
          <p className="mt-2 text-sm text-text-default">
            Your current plan <span className="font-semibold uppercase">{activePlan}</span> does not include this feature.
          </p>
          <button
            type="button"
            onClick={() => setActiveView('pricing')}
            className="mt-4 rounded-lg bg-primary-dusty-blue px-3 py-2 text-sm font-medium text-background-warm-off-white hover:bg-primary-soft-sky"
          >
            View Plans
          </button>
        </div>
      );
    }

    if (activeView === 'landing') {
      return <Landing onLoginClick={goToLogin} onRegisterClick={goToRegister} onNavigate={goToPublicPage} />;
    }

    if (activeView === 'home') {
      return <Home onRegisterClick={goToRegister} setActiveView={setActiveView} />;
    }

    if (activeView === 'pricing') {
      return (
        <ActiveComponent
          setActiveView={setActiveView}
          authUser={authUser}
          activePlan={activePlan}
          isAuthenticated={isAuthenticated}
          onPlanSelect={handlePlanSelect}
        />
      );
    }

    if (activeView === 'settings') {
      return (
        <ActiveComponent
          setActiveView={setActiveView}
          userName={authUser?.name}
          authUser={authUser}
          theme={theme}
          setTheme={setTheme}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          onAuthUserUpdated={(nextUser) => setAuthUser((prev) => ({ ...(prev || {}), ...(nextUser || {}) }))}
          onWorkspaceUpdated={(workspaceName) => {
            if (!workspaceName) return;
            setUserWorkspaces((prev) =>
              prev.map((workspace) =>
                String(workspace.workspaceId) === String(selectedWorkspaceId)
                  ? { ...workspace, name: workspaceName }
                  : workspace
              )
            );
          }}
        />
      );
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
          allowedViews={allowedSidebarViews}
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

          <MemoryRouter>
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
          </MemoryRouter>

          <Footer />
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3500} newestOnTop />
    </div>
  );
}
