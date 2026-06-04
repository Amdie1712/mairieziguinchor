const Report = require('../models/Report');

exports.getAll = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.create = async (req, res) => {
    try {
        const report = await Report.create(req.body);
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const updated = await Report.updateStatus(id, status);
        if(updated) {
            res.json({ success: true, id, status });
        } else {
            res.status(404).json({ error: "Signalement non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.treat = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status, assigned_service } = req.body;
        const updated = await Report.treat(id, { status, assigned_service });
        if(updated) {
            res.json({ success: true, id, status, assigned_service });
        } else {
            res.status(404).json({ error: "Signalement non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Report.delete(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};