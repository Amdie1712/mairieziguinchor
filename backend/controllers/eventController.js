const Event = require('../models/Event');

exports.getAll = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
};

exports.create = async (req, res) => {
    try {
        let eventData = { ...req.body };
        if (req.file) {
            eventData.imageUrl = `/uploads/events/${req.file.filename}`;
        }
        const event = await Event.create(eventData);
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création de l'événement" });
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let eventData = { ...req.body };
        if (req.file) {
            eventData.imageUrl = `/uploads/events/${req.file.filename}`;
        }
        const success = await Event.update(id, eventData);
        if (success) {
            res.json({ success: true, id, ...eventData });
        } else {
            res.status(404).json({ error: "Événement non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
};

exports.delete = async (req, res) => {
    try {
        await Event.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};