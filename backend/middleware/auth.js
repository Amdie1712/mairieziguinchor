
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mairie_ziguinchor_secret_key_2024';

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Accès non autorisé. Jeton manquant." });
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        const decodedToken = jwt.verify(token, JWT_SECRET);
        
        // On attache les infos de l'utilisateur à la requête
        req.user = {
            id: decodedToken.userId,
            role: decodedToken.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: "Session expirée ou jeton invalide." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Privilèges insuffisants. Administration uniquement." });
    }
};

const isStaff = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'employe')) {
        next();
    } else {
        res.status(403).json({ error: "Privilèges insuffisants. Réservé au personnel municipal." });
    }
};

module.exports = { authenticate, isAdmin, isStaff };
