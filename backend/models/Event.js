const db = require('../db');

class Event {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM events ORDER BY date ASC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { title, category, description, imageUrl, date, time, location } = data;
        const [result] = await db.query(
            'INSERT INTO events (title, category, description, imageUrl, date, time, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, category, description, imageUrl, date, time, location]
        );
        return { id: result.insertId, ...data };
    }

    static async update(id, data) {
        const { title, category, description, imageUrl, date, time, location } = data;
        const [result] = await db.query(
            'UPDATE events SET title = ?, category = ?, description = ?, imageUrl = ?, date = ?, time = ?, location = ? WHERE id = ?',
            [title, category, description, imageUrl, date, time, location, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Event;