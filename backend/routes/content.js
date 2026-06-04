const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier pour les documents
const docDir = 'uploads/documents/';
if (!fs.existsSync(docDir)){
    fs.mkdirSync(docDir, { recursive: true });
}

// Dossier pour les images des quartiers
const neighborhoodDir = 'uploads/neighborhoods/';
if (!fs.existsSync(neighborhoodDir)){
    fs.mkdirSync(neighborhoodDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') cb(null, neighborhoodDir);
        else cb(null, docDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = (req, res, next) => {
    const multerUpload = multer({ 
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'image') {
                const filetypes = /jpeg|jpg|png|webp/;
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);
                if (mimetype && extname) return cb(null, true);
                cb(new Error('Images uniquement!'));
            } else {
                if (path.extname(file.originalname).toLowerCase() === '.pdf') {
                    cb(null, true);
                } else {
                    cb(new Error('Seuls les fichiers PDF sont autorisés.'));
                }
            }
        }
    }).fields([{ name: 'document', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

    multerUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "Erreur Multer: " + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        // Map req.files to req.file if only one exists for compatibility with existing logic if needed
        if (req.files) {
            if (req.files.document) req.file = req.files.document[0];
            else if (req.files.image) req.file = req.files.image[0];
        }
        
        next();
    });
};

const { authenticate, isAdmin } = require('../middleware/auth');

// Services
router.get('/services', contentController.getServices);
router.post('/services', authenticate, isAdmin, contentController.addService);
router.put('/services/:id', authenticate, isAdmin, contentController.updateService);
router.delete('/services/:id', authenticate, isAdmin, contentController.deleteService);

// Seed
router.post('/seed', authenticate, isAdmin, contentController.seedData);

// Documents
router.get('/documents', contentController.getDocuments);
router.post('/documents', authenticate, isAdmin, upload, contentController.addDocument);
router.put('/documents/:id', authenticate, isAdmin, upload, contentController.updateDocument);
router.delete('/documents/:id', authenticate, isAdmin, contentController.deleteDocument);

// Procedures
router.get('/procedures', contentController.getProcedures);
router.post('/procedures', authenticate, isAdmin, contentController.addProcedure);
router.put('/procedures/:id', authenticate, isAdmin, contentController.updateProcedure);
router.delete('/procedures/:id', authenticate, isAdmin, contentController.deleteProcedure);

// Projects
router.get('/projects', contentController.getProjects);
router.post('/projects', authenticate, isAdmin, contentController.addProject);
router.put('/projects/:id', authenticate, isAdmin, contentController.updateProject);
router.delete('/projects/:id', authenticate, isAdmin, contentController.deleteProject);

// Neighborhoods
router.get('/neighborhoods', contentController.getNeighborhoods);
router.post('/neighborhoods', authenticate, isAdmin, upload, contentController.addNeighborhood);
router.put('/neighborhoods/:id', authenticate, isAdmin, upload, contentController.updateNeighborhood);
router.delete('/neighborhoods/:id', authenticate, isAdmin, contentController.deleteNeighborhood);

// About
router.get('/about', contentController.getAbout);
router.post('/about', authenticate, isAdmin, contentController.createAbout);
router.put('/about/:id', authenticate, isAdmin, contentController.updateAbout);
router.delete('/about/:id', authenticate, isAdmin, contentController.deleteAbout);

// About Stats
router.get('/about-stats', contentController.getAboutStats);
router.post('/about-stats', authenticate, isAdmin, contentController.addAboutStat);
router.put('/about-stats/:id', authenticate, isAdmin, contentController.updateAboutStat);
router.delete('/about-stats/:id', authenticate, isAdmin, contentController.deleteAboutStat);

// Images
router.get('/images', contentController.getImages);
router.post('/images', authenticate, isAdmin, upload, contentController.addImage);
router.delete('/images/:id', authenticate, isAdmin, contentController.deleteImage);
router.get('/system-images', contentController.getSystemImages);
router.post('/system-images', authenticate, isAdmin, upload, contentController.setSystemImage);

module.exports = router;