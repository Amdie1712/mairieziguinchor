const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', authenticate, isAdmin, messageController.getAll);
router.post('/', messageController.create);
router.put('/:id/status', authenticate, isAdmin, messageController.updateStatus);
router.delete('/:id', authenticate, isAdmin, messageController.delete);

module.exports = router;