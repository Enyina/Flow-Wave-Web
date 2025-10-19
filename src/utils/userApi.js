import apiFetch from './api';

const API_PREFIX = '/users';

export async function getProfile() {
  const res = await apiFetch(`${API_PREFIX}/me`);
  if (!res.ok) return res;
  // Normalize common response shapes: { data: user }, { user: { ... } }, or raw user
  const user = res.data?.data || res.data?.user || res.data;
  return { ok: true, status: res.status, data: user };
}

// 1️⃣ Change Email (sends confirmation link)
export async function changeEmail(newEmail) {
  return apiFetch(`${API_PREFIX}/change-email`, { method: 'POST', body: { newEmail } });
}

// 2️⃣ Confirm Email Change
export async function confirmEmailChange(token) {
  return apiFetch(`${API_PREFIX}/confirm-email-change`, { method: 'POST', body: { token } });
}

// 3️⃣ Change Password
export async function changePassword(currentPassword, newPassword) {
  return apiFetch(`${API_PREFIX}/change-password`, { method: 'POST', body: { currentPassword, newPassword } });
}

// 4️⃣ Update Address
export async function updateAddress({ address, city, state, zip, country }) {
  return apiFetch(`${API_PREFIX}/address`, { method: 'PATCH', body: { address, city, state, zip, country } });
}

// 5️⃣ Upload Profile Picture
export async function uploadProfilePicture(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch(`${API_PREFIX}/profile-picture`, { method: 'PATCH', body: form });
}

export default {
  getProfile,
  changeEmail,
  confirmEmailChange,
  changePassword,
  updateAddress,
  uploadProfilePicture,
};
