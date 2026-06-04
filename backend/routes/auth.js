const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticate, authController.getMe);
router.get('/users', authenticate, isAdmin, authController.getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, authController.deleteUser);
router.put('/users/:id', authenticate, isAdmin, authController.updateUser);
router.put('/users/:id/reset-password', authenticate, isAdmin, authController.resetPassword);

module.exports = router;