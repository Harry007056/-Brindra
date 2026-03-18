import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { clearAuthTokens, getAccessToken, getRefreshToken } from '../api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));
  const [authUser, setAuthUser] = useState(null);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(() => localStorage.getItem('activeWorkspaceId') || '');
  const [activeRole, setActiveRole] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(() => Boolean(getAccessToken()));

  const hydrateSession = useCallback(async () => {
    if (!getAccessToken()) {
      setSessionLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data?.user || null;
      const workspaces = Array.isArray(response.data?.workspaces) ? response.data?.workspaces : [];
      const defaultWorkspace = workspaces.find((w) => w.workspaceId === selectedWorkspaceId) || workspaces[0] || null;

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
      localStorage.removeItem('activeWorkspaceId');
      clearAuthTokens();
      setAuthUser(null);
      setUserWorkspaces([]);
      setSelectedWorkspaceId('');
      setActiveRole(null);
      setIsAuthenticated(false);
    } finally {
      setSessionLoading(false);
    }
  }, [selectedWorkspaceId]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: getRefreshToken() });
    } catch {}
    
    localStorage.removeItem('activeWorkspaceId');
    clearAuthTokens();
    setAuthUser(null);
    setUserWorkspaces([]);
    setSelectedWorkspaceId('');
    setActiveRole(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  return {
    isAuthenticated,
    authUser,
    userWorkspaces,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    activeRole,
    sessionLoading,
    hydrateSession,
    handleLogout
  };
};
