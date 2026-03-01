import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function getAccessToken() {
  return localStorage.getItem('authToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem('authToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

export function clearAuthTokens() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
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
