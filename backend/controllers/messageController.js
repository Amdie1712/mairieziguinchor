const Message = require('../models/Message');

exports.getAll = async (req, res) => {
    try {
        const messages = await Message.findAll();
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.create = async (req, res) => {
    try {
        const msg = await Message.create(req.body);
        res.json(msg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        await Message.updateStatus(id, status);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Message.delete(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};