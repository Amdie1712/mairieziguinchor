
const express = require('express');
const router = express.Router();
const dossierController = require('../controllers/dossierController');
const { authenticate, isAdmin, isStaff } = require('../middleware/auth');

router.get('/', authenticate, isStaff, dossierController.getAll);
router.get('/user/:userId', authenticate, dossierController.getByUser);
router.post('/', authenticate, dossierController.create);
router.put('/:id/status', authenticate, isStaff, dossierController.updateStatus);
router.put('/:id/treat', authenticate, isStaff, dossierController.treat);
router.delete('/:id', authenticate, isAdmin, dossierController.delete);

module.exports = router;
