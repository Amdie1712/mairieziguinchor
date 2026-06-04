const db = require('../db');

class Message {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM messages ORDER BY date DESC');
        return rows;
    }

    static async create(msgData) {
        const { name, email, subject, message } = msgData;
        const date = new Date().toISOString();
        const status = 'Nouveau';

        const [result] = await db.query(
            'INSERT INTO messages (name, email, subject, message, date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, subject, message, date, status]
        );

        return { id: result.insertId, ...msgData, date, status };
    }

    static async updateStatus(id, status) {
        const [result] = await db.query('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM messages WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Message;