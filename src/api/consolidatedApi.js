import axios from 'axios';
import TokenManager from '../utils/tokenManager';
import { useAuthStore } from '../stores/authStore';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('🔗 API Base URL:', API_BASE);

// Create consolidated axios instance
export const apiClient = axios.create({
  baseURL: API_BASE.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for httpOnly refresh tokens
});

// Track ongoing refresh requests to prevent multiple simultaneous refreshes
let refreshPromise = null;

// Request interceptor: attach access token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = TokenManager.getAccessToken();
      console.log('🔍 Request interceptor - token:', token);
      console.log('🔍 Request interceptor - URL:', config.url);
      console.log('🔍 Request interceptor - method:', config.method);
      
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization && !config.headers.authorization) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔍 Request interceptor - Authorization header set:', config.headers.Authorization);
        }
      } else {
        console.warn('🔍 Request interceptor - No token found!');
      }
    } catch (e) {
      console.error('Request interceptor error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh and auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    try {
      const status = error?.response?.status;
      
      // Handle 401/403 - for now, just clear auth (no refresh endpoint)
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        console.log('❌ Auth error detected, clearing authentication');
        handleAuthFailure();
      }
    } catch (e) {
      console.error('Response interceptor error:', e);
    }

    return Promise.reject(error);
  }
);

// Perform token refresh
async function performTokenRefresh() {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send httpOnly refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.accessToken) {
        TokenManager.setAccessToken(data.accessToken);
        
        // Update auth store
        const authStore = useAuthStore.getState();
        authStore.setTokens({ 
          accessToken: data.accessToken, 
          refreshToken: data.refreshToken || null 
        });
        
        return data;
      } else {
        throw new Error('No access token in refresh response');
      }
    } else {
      throw new Error(`Refresh failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

// Handle authentication failure
function handleAuthFailure() {
  try {
    // Clear all auth data
    TokenManager.clearTokens();
    
    // Clear auth store
    const authStore = useAuthStore.getState();
    authStore.clearAuth();
    
    // Emit global logout event
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Optional: redirect to login (uncomment if needed)
    // window.location.href = '/login';
  } catch (e) {
    console.error('Error handling auth failure:', e);
  }
}

// Consolidated apiFetch function
export async function apiFetch(path, options = {}) {
  // Ensure URL starts with a slash
  const url = path && path.startsWith('/') ? path : `/${(path || '').replace(/^\//, '')}`;
  const method = (options.method || 'GET').toLowerCase();

  // Clone provided headers
  const headers = { ...(options.headers || {}) };

  // Handle FormData
  if (options.body && typeof FormData !== 'undefined' && options.body instanceof FormData) {
    // Remove Content-Type so browser sets multipart boundary
    delete headers['Content-Type'];
    delete headers['content-type'];
    console.log('🔍 apiFetch - FormData detected, removed Content-Type header');
    console.log('🔍 apiFetch - FormData content length:', options.body.entries.length);
    for (let [key, value] of options.body.entries()) {
      console.log(`🔍 apiFetch - FormData entry: ${key}:`, value.name || value);
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

  console.log('🔍 apiFetch - Request options:', {
    url: axiosOptions.url,
    method: axiosOptions.method,
    headers: axiosOptions.headers,
    hasData: !!axiosOptions.data,
    dataIsFormData: axiosOptions.data instanceof FormData
  });

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

// Utility functions for specific HTTP methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config).then(res => res.data),
  post: (url, data, config = {}) => apiClient.post(url, data, config).then(res => res.data),
  put: (url, data, config = {}) => apiClient.put(url, data, config).then(res => res.data),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config).then(res => res.data),
  delete: (url, config = {}) => apiClient.delete(url, config).then(res => res.data),
};

// Export default
export default apiClient;
