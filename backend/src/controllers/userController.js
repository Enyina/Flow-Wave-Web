const asyncHandler = require('../middleware/asyncHandler');
const userService = require('../services/userService');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.json({ id: user.id, email: user.email, isEmailVerified: user.isEmailVerified, mfaEnabled: user.mfaEnabled, createdAt: user.createdAt });
});

const updateMe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const data = {};
  if (email) data.email = email;
  const updated = await userService.updateUser(req.user.id, data);
  res.json({ id: updated.id, email: updated.email });
});

module.exports = { getMe, updateMe };
