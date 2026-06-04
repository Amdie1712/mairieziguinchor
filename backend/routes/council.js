const express = require('express');
const router = express.Router();
const councilController = require('../controllers/councilController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier pour les photos des membres
const memberDir = 'uploads/members/';
if (!fs.existsSync(memberDir)){
    fs.mkdirSync(memberDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') cb(null, memberDir);
        else cb(null, 'uploads/sessions/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Assurez-vous que le dossier sessions existe
const sessionDir = 'uploads/sessions/';
if (!fs.existsSync(sessionDir)){
    fs.mkdirSync(sessionDir, { recursive: true });
}

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            const filetypes = /jpeg|jpg|png|webp/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            if (mimetype && extname) return cb(null, true);
            cb(new Error('Images uniquement!'));
        } else {
            if (path.extname(file.originalname).toLowerCase() === '.pdf') return cb(null, true);
            cb(new Error('Seuls les fichiers PDF sont autorisés.'));
        }
    }
});

const { authenticate, isAdmin, isStaff } = require('../middleware/auth');

// Members
router.get('/members', councilController.getMembers);
router.post('/members', authenticate, isStaff, upload.single('image'), councilController.addMember);
router.put('/members/:id', authenticate, isStaff, upload.single('image'), councilController.updateMember);
router.delete('/members/:id', authenticate, isStaff, councilController.deleteMember);

// Sessions
router.get('/sessions', councilController.getSessions);
router.post('/sessions', authenticate, isStaff, upload.single('document'), councilController.addSession);
router.put('/sessions/:id', authenticate, isStaff, upload.single('document'), councilController.updateSession);
router.delete('/sessions/:id', authenticate, isStaff, councilController.deleteSession);

module.exports = router;