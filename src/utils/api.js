import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5500/api';


export const apiClient = axios.create({
  baseURL: API_BASE.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor: attach Authorization from localStorage when not explicitly provided
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore localStorage errors (e.g., SSR)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if auth fails (401/403), clear auth and notify app
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        try { localStorage.removeItem('authToken'); } catch (e) {}
        try { localStorage.removeItem('userData'); } catch (e) {}
        // Emit a global event so React can react if needed
        try { window.dispatchEvent(new CustomEvent('auth:logout')); } catch (e) {}
        // Redirect to login page
        try { window.location.href = '/login'; } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(error);
  }
);

export async function apiFetch(path, options = {}) {
  // Ensure URL starts with a slash so axios concatenates baseURL correctly
  const url = path && path.startsWith('/') ? path : `/${(path || '').replace(/^\//, '')}`;
  const method = (options.method || 'GET').toLowerCase();

  // Clone provided headers so we don't mutate caller's object
  const headers = { ...(options.headers || {}) };

  // If caller provided an Authorization header explicitly, keep it. Otherwise the interceptor will attach one.

  // If body is FormData, remove Content-Type so browser/axios sets multipart boundary
  if (options.body && typeof FormData !== 'undefined' && options.body instanceof FormData) {
    // remove any content-type header so axios can set the correct multipart/form-data boundary
    if (headers['Content-Type'] || headers['content-type']) {
      delete headers['Content-Type'];
      delete headers['content-type'];
    }
  }

  const axiosOptions = {
    url,
    method,
    headers,
    data: options.body,
    params: options.params,
    withCredentials: options.credentials === 'omit' ? false : true,
    timeout: options.timeout || 0,
  };

  try {
    const res = await apiClient.request(axiosOptions);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err && err.response) {
      return { ok: false, status: err.response.status, data: err.response.data };
    }
    return { ok: false, status: 0, data: { error: err.message || 'Network error' } };
  }
}

export default apiFetch;
