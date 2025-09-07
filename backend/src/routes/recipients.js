const express = require('express');
const router = express.Router();
const { listRecipients, createRecipient, deleteRecipient } = require('../controllers/recipientController');

router.get('/', listRecipients);
router.post('/', createRecipient);
router.delete('/:id', deleteRecipient);

module.exports = router;
