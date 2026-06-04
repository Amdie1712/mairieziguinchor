const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const { authenticate, isAdmin, isStaff } = require('../middleware/auth');
const upload = multer({ storage });

router.get('/', articleController.getAll);
router.get('/:id', articleController.getById);

// 'image' is the field name in the form-data
router.post('/', authenticate, isStaff, upload.single('image'), articleController.create);
router.put('/:id', authenticate, isStaff, upload.single('image'), articleController.update);
router.delete('/:id', authenticate, isStaff, articleController.delete);

// Route spéciale pour reset la DB (dev only)
router.post('/reset', authenticate, isAdmin, articleController.reset);

module.exports = router;