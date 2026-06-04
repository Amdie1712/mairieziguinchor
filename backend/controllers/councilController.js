const Council = require('../models/Council');

// Members
exports.getMembers = async (req, res) => {
    try {
        const members = await Council.getMembers();
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addMember = async (req, res) => {
    try {
        let imageUrl = req.body.image || '';
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/members/${req.file.filename}`;
        }

        const memberData = {
            name: req.body.name,
            role: req.body.role,
            commission: req.body.commission || '',
            image: imageUrl
        };

        const member = await Council.addMember(memberData);
        res.json(member);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout" });
    }
};

exports.updateMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const members = await Council.getMembers();
        const currentMember = members.find(m => m.id === id);

        let imageUrl = req.body.image || (currentMember ? currentMember.image : '');
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/members/${req.file.filename}`;
        }

        const memberData = {
            name: req.body.name,
            role: req.body.role,
            commission: req.body.commission || '',
            image: imageUrl
        };

        const success = await Council.updateMember(id, memberData);
        if (success) res.json({ success: true, id, ...memberData });
        else res.status(404).json({ error: "Membre non trouvé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour" });
    }
};

exports.deleteMember = async (req, res) => {
    try {
        const success = await Council.deleteMember(req.params.id);
        if (success) res.json({ success: true });
        else res.status(404).json({ error: "Membre non trouvé" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};

// Sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Council.getSessions();
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addSession = async (req, res) => {
    try {
        let docUrl = req.body.docUrl || '';
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            docUrl = `${protocol}://${host}/uploads/sessions/${req.file.filename}`;
        }

        const sessionData = {
            date: req.body.date,
            title: req.body.title,
            agenda: req.body.agenda || '',
            status: req.body.status,
            docUrl: docUrl
        };

        const session = await Council.addSession(sessionData);
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur ajout session" });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const sessions = await Council.getSessions();
        const currentSession = sessions.find(s => s.id === id);

        let docUrl = req.body.docUrl || (currentSession ? currentSession.docUrl : '');
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            docUrl = `${protocol}://${host}/uploads/sessions/${req.file.filename}`;
        }

        const sessionData = {
            date: req.body.date,
            title: req.body.title,
            agenda: req.body.agenda || '',
            status: req.body.status,
            docUrl: docUrl
        };

        const success = await Council.updateSession(id, sessionData);
        if (success) res.json({ success: true, id, ...sessionData });
        else res.status(404).json({ error: "Session non trouvée" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur mise à jour session" });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const success = await Council.deleteSession(req.params.id);
        if (success) res.json({ success: true });
        else res.status(404).json({ error: "Session non trouvée" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur suppression session" });
    }
};