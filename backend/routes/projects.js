const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', projectController.getAll);
router.get('/type/:type', projectController.getByType);
router.get('/stats', projectController.getStats);
router.get('/:id', projectController.getById);

// Admin routes
router.post('/', authenticate, isAdmin, projectController.create);
router.put('/:id', authenticate, isAdmin, projectController.update);
router.delete('/:id', authenticate, isAdmin, projectController.delete);

module.exports = router;
