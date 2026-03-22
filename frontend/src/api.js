import axios from 'axios';
import { API_BASE_URL } from './config';

const AUTH_SESSIONS_KEY = 'brindra-auth-sessions';
const ACTIVE_SESSION_ID_KEY = 'brindra-active-session-id';
const LAST_SESSION_ID_KEY = 'brindra-last-session-id';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function readSessions() {
  try {
    const raw = localStorage.getItem(AUTH_SESSIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSessions(sessions) {
  localStorage.setItem(AUTH_SESSIONS_KEY, JSON.stringify(sessions));
}

function createSessionId(userEmail = '') {
  const seed = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${userEmail || 'session'}:${seed}`;
}

export function getActiveSessionId() {
  const current = sessionStorage.getItem(ACTIVE_SESSION_ID_KEY);
  if (current) return current;

  const lastSession = localStorage.getItem(LAST_SESSION_ID_KEY);
  if (lastSession) {
    sessionStorage.setItem(ACTIVE_SESSION_ID_KEY, lastSession);
    return lastSession;
  }

  return null;
}

function setActiveSessionId(sessionId) {
  if (!sessionId) return;
  sessionStorage.setItem(ACTIVE_SESSION_ID_KEY, sessionId);
  localStorage.setItem(LAST_SESSION_ID_KEY, sessionId);
}

export function getAccessToken() {
  const sessionId = getActiveSessionId();
  if (!sessionId) return null;
  return readSessions()?.[sessionId]?.accessToken || null;
}

export function getRefreshToken() {
  const sessionId = getActiveSessionId();
  if (!sessionId) return null;
  return readSessions()?.[sessionId]?.refreshToken || null;
}

export function setAuthTokens({ accessToken, refreshToken, sessionId, userEmail }) {
  if (!accessToken) return;

  const sessions = readSessions();
  const resolvedSessionId = sessionId || getActiveSessionId() || createSessionId(userEmail);
  const existing = sessions[resolvedSessionId] || {};

  sessions[resolvedSessionId] = {
    ...existing,
    accessToken,
    refreshToken: refreshToken || existing.refreshToken || null,
    userEmail: userEmail || existing.userEmail || '',
    updatedAt: Date.now(),
  };

  writeSessions(sessions);
  setActiveSessionId(resolvedSessionId);
}

export function clearAuthTokens() {
  const sessionId = getActiveSessionId();
  if (!sessionId) return;

  const sessions = readSessions();
  delete sessions[sessionId];
  writeSessions(sessions);
  sessionStorage.removeItem(ACTIVE_SESSION_ID_KEY);

  const remainingSessionIds = Object.keys(sessions);
  if (remainingSessionIds.length === 0) {
    localStorage.removeItem(LAST_SESSION_ID_KEY);
  } else if (localStorage.getItem(LAST_SESSION_ID_KEY) === sessionId) {
    localStorage.setItem(LAST_SESSION_ID_KEY, remainingSessionIds[remainingSessionIds.length - 1]);
  }
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/register');

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
      }

      const refreshResponse = await refreshPromise;
      const newAccessToken =
        refreshResponse.data?.token ||
        refreshResponse.data?.accessToken ||
        refreshResponse.data?.data?.token;
      const newRefreshToken = refreshResponse.data?.refreshToken;

      if (!newAccessToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      setAuthTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken || refreshToken });
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

export default api;
