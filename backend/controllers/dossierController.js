
const Dossier = require('../models/Dossier');

exports.getAll = async (req, res) => {
    try {
        const dossiers = await Dossier.findAll();
        res.json(dossiers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getById = async (req, res) => {
    try {
        const dossier = await Dossier.findById(req.params.id);
        if (dossier) res.json(dossier);
        else res.status(404).json({ error: "Dossier non trouvé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const dossiers = await Dossier.findByUserId(userId);
        res.json(dossiers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.create = async (req, res) => {
    try {
        const { userId, type, description, formData, assigned_service, user_email, user_name } = req.body;
        
        let finalUserId = userId;
        
        // Si le userId est manquant (création par un admin par exemple), on tente de retrouver l'utilisateur par son email
        if (!finalUserId && user_email) {
            const User = require('../models/User');
            const user = await User.findByEmail(user_email);
            if (user) {
                finalUserId = user.id;
            }
        }
        
        const dossier = await Dossier.create(finalUserId, { type, description, formData, assigned_service, user_name, user_email });
        res.json(dossier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        await Dossier.updateStatus(id, status, comment);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.treat = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_service, internal_notes, service_feedback } = req.body;
        const updated = await Dossier.treat(id, { status, assigned_service, internal_notes, service_feedback });
        if (updated) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Dossier non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Dossier.delete(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
