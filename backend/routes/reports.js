
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, isAdmin, isStaff } = require('../middleware/auth');

router.get('/', authenticate, isStaff, reportController.getAll);
router.post('/', reportController.create); // Création autorisée sans jeton (citoyens anonymes)
router.put('/:id/status', authenticate, isStaff, reportController.updateStatus);
router.put('/:id/treat', authenticate, isStaff, reportController.treat);
router.delete('/:id', authenticate, isAdmin, reportController.delete);

module.exports = router;
