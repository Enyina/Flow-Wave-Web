import api from './axios'; // your axios instance

export const userApi = {
  updateProfile: (dto, token) =>
    api.patch('users/me', dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(r => r.data),
};
