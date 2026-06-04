
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mairie_ziguinchor_secret_key_2024';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: "Identifiants invalides." });
        }

        // Vérification sécurisée du mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants invalides." });
        }
        
        // Génération du jeton JWT (expire dans 24h)
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...safeUser } = user;
        res.json({ ...safeUser, token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, assigned_service, assignedService } = req.body;
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        // Hachage du mot de passe avant insertion en base de données
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création de l'utilisateur
        const newUserData = {
            name,
            email,
            password: hashedPassword,
            role: role || 'citoyen',
            assigned_service: assigned_service || assignedService || null
        };

        const newUser = await User.create(newUserData);
        
        // Génération du jeton pour le nouvel utilisateur
        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...safeUser } = newUser;
        res.json({ ...safeUser, token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getMe = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });
        
        const { password: _, ...safeUser } = user;
        res.json(safeUser);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await User.delete(id);
        if (success) {
            res.json({ message: "Utilisateur supprimé avec succès." });
        } else {
            res.status(404).json({ error: "Utilisateur non trouvé." });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.update(id, req.body);
        res.json(updatedUser);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ error: "Le mot de passe est obligatoire." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updatePassword(id, hashedPassword);
        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la réinitialisation." });
    }
};
