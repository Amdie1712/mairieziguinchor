const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { authenticate, isAdmin, isStaff } = require('../middleware/auth');

// Folder for event images
const eventDir = 'uploads/events/';
if (!fs.existsSync(eventDir)){
    fs.mkdirSync(eventDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, eventDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Images uniquement!'));
    }
}).single('image');

router.get('/', eventController.getAll);
router.post('/', authenticate, isStaff, upload, eventController.create);
router.put('/:id', authenticate, isStaff, upload, eventController.update);
router.delete('/:id', authenticate, isStaff, eventController.delete);

module.exports = router;