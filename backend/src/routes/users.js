const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { getMe, updateMe } = require('../controllers/userController');

router.get('/me', asyncHandler(getMe));
router.put('/me', asyncHandler(updateMe));

module.exports = router;
