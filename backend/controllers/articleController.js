const Article = require('../models/Article');

exports.getAll = async (req, res) => {
    try {
        let { page, limit, category } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 9;
        const offset = (page - 1) * limit;

        // Appel au modèle qui gère la requête SQL
        const result = await Article.findAll(limit, offset, category);
        
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
};

exports.getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const article = await Article.findById(id);
        
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: "Article non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.create = async (req, res) => {
    try {
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        const articleData = {
            ...req.body,
            imageUrl: imageUrl || 'https://picsum.photos/800/600'
        };

        const newArticle = await Article.create(articleData);
        res.json(newArticle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        const articleData = {
            ...req.body,
            imageUrl: imageUrl // Garde l'ancienne URL si pas de nouvelle image uploadée
        };

        const success = await Article.update(id, articleData);
        if (success) {
            res.json({ success: true, ...articleData, id });
        } else {
            res.status(404).json({ error: "Article non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = await Article.delete(id);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: "Article non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};

exports.reset = async (req, res) => {
    try {
        await Article.reset();
        res.json({ success: true, message: "Base de données réinitialisée" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors du reset" });
    }
};