const Content = require('../models/Content');

// --- Services ---
exports.getServices = async (req, res) => {
    try {
        const services = await Content.getServices();
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addService = async (req, res) => {
    try {
        const service = await Content.addService(req.body);
        res.json(service);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur ajout service" });
    }
};

exports.updateService = async (req, res) => {
    try {
        await Content.updateService(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour service" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        await Content.deleteService(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur suppression service" });
    }
};

exports.seedData = async (req, res) => {
    try {
        await Content.seedData();
        res.json({ success: true, message: "Données initialisées" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'initialisation" });
    }
};

// --- Documents ---
exports.getDocuments = async (req, res) => {
    try {
        const docs = await Content.getDocuments();
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addDocument = async (req, res) => {
    try {
        let fileUrl = '';
        let size = req.body.size || '0 Mo';

        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/documents/${req.file.filename}`;
            // Calculer la taille réelle si Multer nous la donne
            size = (req.file.size / (1024 * 1024)).toFixed(2) + ' Mo';
        }

        const docData = {
            name: req.body.name,
            description: req.body.description || '',
            date: req.body.date || new Date().toISOString().split('T')[0],
            type: 'PDF',
            category: req.body.category,
            size: size,
            fileUrl: fileUrl
        };

        const doc = await Content.addDocument(docData);
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const currentDoc = (await Content.getDocuments()).find(d => d.id === id);
        
        let fileUrl = req.body.fileUrl || (currentDoc ? currentDoc.fileUrl : '');
        let size = req.body.size || (currentDoc ? currentDoc.size : '0 Mo');

        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/documents/${req.file.filename}`;
            size = (req.file.size / (1024 * 1024)).toFixed(2) + ' Mo';
        }

        const docData = {
            name: req.body.name,
            description: req.body.description || (currentDoc ? currentDoc.description : ''),
            date: req.body.date || (currentDoc ? currentDoc.date : new Date().toISOString().split('T')[0]),
            category: req.body.category,
            type: 'PDF',
            size: size,
            fileUrl: fileUrl
        };

        const success = await Content.updateDocument(id, docData);
        if (success) res.json({ success: true, id, ...docData });
        else res.status(404).json({ error: "Document non trouvé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour document" });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        await Content.deleteDocument(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// --- Procedures ---
exports.getProcedures = async (req, res) => {
    try {
        const procs = await Content.getProcedures();
        res.json(procs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addProcedure = async (req, res) => {
    try {
        const proc = await Content.addProcedure(req.body);
        res.json(proc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur ajout démarche" });
    }
};

exports.updateProcedure = async (req, res) => {
    try {
        await Content.updateProcedure(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour démarche" });
    }
};

exports.deleteProcedure = async (req, res) => {
    try {
        await Content.deleteProcedure(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur suppression démarche" });
    }
};

// --- Projects ---
exports.getProjects = async (req, res) => {
    try {
        const projects = await Content.getProjects();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addProject = async (req, res) => {
    try {
        const project = await Content.addProject(req.body);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur ajout projet" });
    }
};

exports.updateProject = async (req, res) => {
    try {
        await Content.updateProject(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour projet" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Content.deleteProject(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur suppression projet" });
    }
};

// --- Neighborhoods ---
exports.getNeighborhoods = async (req, res) => {
    try {
        const hoods = await Content.getNeighborhoods();
        res.json(hoods);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addNeighborhood = async (req, res) => {
    try {
        let imageUrl = req.body.image || '';
        if (req.files && req.files.image) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/neighborhoods/${req.files.image[0].filename}`;
        }

        const hoodData = {
            name: req.body.name,
            representative: req.body.representative,
            nextMeeting: req.body.nextMeeting,
            location: req.body.location,
            description: req.body.description,
            image: imageUrl,
            reports_url: req.body.reports_url,
            contact_email: req.body.contact_email
        };

        const hood = await Content.addNeighborhood(hoodData);
        res.json(hood);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur ajout quartier" });
    }
};

exports.updateNeighborhood = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log('Updating neighborhood with ID:', id);
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const hoods = await Content.getNeighborhoods();
        const currentHood = hoods.find(h => h.id === id);

        let imageUrl = req.body.image || (currentHood ? currentHood.image : '');
        if (req.files && req.files.image) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/neighborhoods/${req.files.image[0].filename}`;
            console.log('New image URL:', imageUrl);
        }

        const hoodData = {
            name: req.body.name,
            representative: req.body.representative,
            nextMeeting: req.body.nextMeeting,
            location: req.body.location,
            description: req.body.description,
            image: imageUrl,
            reports_url: req.body.reports_url,
            contact_email: req.body.contact_email
        };
        
        console.log('Final hood data for model:', hoodData);

        await Content.updateNeighborhood(id, hoodData);
        res.json({ success: true, id, ...hoodData });
    } catch (err) {
        console.error('CRITICAL ERROR in updateNeighborhood:', err);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
};

exports.deleteNeighborhood = async (req, res) => {
    try {
        await Content.deleteNeighborhood(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// --- About ---
exports.getAbout = async (req, res) => {
    try {
        const about = await Content.getAbout();
        res.json(about);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.createAbout = async (req, res) => {
    try {
        const about = await Content.createAbout(req.body);
        res.json(about);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur création section à propos" });
    }
};

exports.updateAbout = async (req, res) => {
    try {
        await Content.updateAbout(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteAbout = async (req, res) => {
    try {
        await Content.deleteAbout(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// --- About Stats ---
exports.getAboutStats = async (req, res) => {
    try {
        const stats = await Content.getAboutStats();
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addAboutStat = async (req, res) => {
    try {
        const stat = await Content.addAboutStat(req.body);
        res.json(stat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateAboutStat = async (req, res) => {
    try {
        await Content.updateAboutStat(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteAboutStat = async (req, res) => {
    try {
        await Content.deleteAboutStat(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// --- Images ---
exports.getImages = async (req, res) => {
    try {
        const images = await Content.getImages();
        res.json(images);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addImage = async (req, res) => {
    try {
        let url = req.body.url || '';
        if (req.files && req.files.image) {
            const protocol = req.protocol;
            const host = req.get('host');
            url = `${protocol}://${host}/uploads/neighborhoods/${req.files.image[0].filename}`;
        }
        
        const img = await Content.addImage({
            title: req.body.title || req.body.name,
            url: url,
            category: req.body.category
        });
        res.json(img);
    } catch (err) {
        console.error('addImage Controller Error:', err);
        res.status(500).json({ error: "Erreur ajout image", details: err.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        await Content.deleteImage(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getSystemImages = async (req, res) => {
    try {
        const map = await Content.getSystemImages();
        res.json(map);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.setSystemImage = async (req, res) => {
    try {
        const { key } = req.body;
        let url = req.body.url;
        
        if (req.files && req.files.image) {
            const protocol = req.protocol;
            const host = req.get('host');
            url = `${protocol}://${host}/uploads/neighborhoods/${req.files.image[0].filename}`;
        }
        
        await Content.setSystemImage(key, url);
        res.json({ success: true, key, url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
