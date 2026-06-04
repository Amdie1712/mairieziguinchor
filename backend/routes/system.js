
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/logs', authenticate, isAdmin, systemController.getLogs);
router.get('/settings', authenticate, isAdmin, systemController.getSettings);
router.put('/settings', authenticate, isAdmin, systemController.updateSettings);

module.exports = router;
