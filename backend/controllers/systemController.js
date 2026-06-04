
const AuditLog = require('../models/AuditLog');
const SiteSetting = require('../models/SiteSetting');

exports.getLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll();
        res.json(logs);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la récupération des logs" });
    }
};

exports.getSettings = async (req, res) => {
    try {
        const settings = await SiteSetting.findAll();
        res.json(settings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la récupération des paramètres" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        await SiteSetting.bulkUpdate(req.body);
        
        // Log action
        await AuditLog.add({
            user_id: req.user.userId,
            action: 'UPDATE_SETTINGS',
            target_type: 'SYSTEM',
            details: JSON.stringify(req.body),
            ip_address: req.ip
        });
        
        res.json({ message: "Paramètres mis à jour avec succès" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la mise à jour des paramètres" });
    }
};
