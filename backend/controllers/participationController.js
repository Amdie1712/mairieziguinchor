const Participation = require('../models/Participation');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Participation.getProjects();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addProject = async (req, res) => {
    try {
        const project = await Participation.addProject(req.body);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la soumission du projet" });
    }
};

exports.vote = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Participation.vote(id);
        if (success) res.json({ success: true });
        else res.status(404).json({ error: "Projet non trouvé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const success = await Participation.updateStatus(id, status);
        if (success) res.json({ success: true });
        else res.status(404).json({ error: "Projet non trouvé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Participation.delete(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Participation.getComments(id);
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_name, comment } = req.body;
        // In a real app, user_id would come from auth middleware
        const user_id = req.user ? req.user.id : null;
        
        const newComment = await Participation.addComment({
            project_id: id,
            user_id,
            user_name,
            comment
        });
        res.json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
    }
};
