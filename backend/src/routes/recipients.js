const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { listRecipients, createRecipient, deleteRecipient } = require('../controllers/recipientController');

router.get('/', asyncHandler(listRecipients));
router.post('/', asyncHandler(createRecipient));
router.delete('/:id', asyncHandler(deleteRecipient));

module.exports = router;
