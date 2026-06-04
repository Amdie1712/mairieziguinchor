const express = require('express');
const router = express.Router();
const participationController = require('../controllers/participationController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/projects', participationController.getProjects);
router.post('/projects', participationController.addProject);
router.post('/projects/:id/vote', participationController.vote);

// Comments
router.get('/projects/:id/comments', participationController.getComments);
router.post('/projects/:id/comments', participationController.addComment);

// Admin only
router.put('/projects/:id/status', authenticate, isAdmin, participationController.updateStatus);
router.delete('/projects/:id', authenticate, isAdmin, participationController.delete);

module.exports = router;
