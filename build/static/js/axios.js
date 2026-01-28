// src/api/axios.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL 

const api = axios.create({
  baseURL: `${API_BASE}/`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export default api;
