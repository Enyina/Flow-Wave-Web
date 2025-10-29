// src/api/authApi.js
import api from './axios';

export const authApi = {
  signup: (dto) => api.post('auth/signup', dto).then((r) => r.data),
  verifyEmail: (dto) => api.post('auth/verify-email', dto).then((r) => r.data),
  resendCode: (email) => api.post('auth/resend-code', { email }).then((r) => r.data),
  createPassword: (dto) => api.post('auth/create-password', dto).then((r) => r.data),
  login: (dto) => api.post('auth/login', dto).then((r) => r.data),
  forgotPassword: (email) => api.post('auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (dto) => api.post('auth/reset-password', dto).then((r) => r.data),
   createPin: (dto, token) => 
    api.post('auth/create-pin', dto, {
      headers: {
        Authorization: `Bearer ${token}`, // pass JWT token
      },
    }).then((r) => r.data),

};
