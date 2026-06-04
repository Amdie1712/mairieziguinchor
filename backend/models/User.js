
const db = require('../db');

class User {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(userData) {
        const { name, email, password, role, assigned_service } = userData;
        // Le rôle par défaut est 'citoyen' conformément au schéma enum
        const finalRole = role || 'citoyen';
        
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, assigned_service) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, finalRole, assigned_service || null]
        );
        return { id: result.insertId, name, email, role: finalRole, assigned_service };
    }

    static async findAll() {
        const [rows] = await db.query('SELECT id, name, email, role, assigned_service FROM users');
        return rows;
    }

    static async update(id, userData) {
        const { name, email, role, assigned_service, status } = userData;
        await db.query(
            'UPDATE users SET name = ?, email = ?, role = ?, assigned_service = ?, status = ? WHERE id = ?',
            [name, email, role, assigned_service || null, status || 'actif', id]
        );
        return { id, name, email, role, assigned_service, status };
    }

    static async updatePassword(id, hashedPassword) {
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
        return true;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
