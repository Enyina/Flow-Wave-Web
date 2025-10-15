import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5500/api';

export const apiClient = axios.create({
  baseURL: API_BASE.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export async function apiFetch(path, options = {}) {
  const url = `${path.replace(/^\//, '')}`;
  const method = (options.method || 'GET').toLowerCase();
  const headers = { ...(options.headers || {}) };

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
