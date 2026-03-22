const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
  const configured = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '');
  if (configured) return configured;

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0';

    if (isLocal) {
      return 'http://localhost:5000/api';
    }

    return '/api';
  }

  return '/api';
};

export const API_BASE_URL = resolveApiBaseUrl();
export const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '') || '/';
