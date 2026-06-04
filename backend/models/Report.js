const db = require('../db');

class Report {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM reports ORDER BY date DESC');
        return rows;
    }

    static async create(reportData) {
        const { type, location, description, email, phone, assigned_service } = reportData;
        const date = new Date().toISOString();
        const status = 'Nouveau';

        const [result] = await db.query(
            'INSERT INTO reports (type, location, description, email, phone, date, status, assigned_service) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [type, location, description, email, phone, date, status, assigned_service || null]
        );

        return { id: result.insertId, ...reportData, date, status };
    }

    static async updateStatus(id, status) {
        const [result] = await db.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async treat(id, data) {
        const { status, assigned_service } = data;
        const [result] = await db.query(
            'UPDATE reports SET status = ?, assigned_service = ? WHERE id = ?',
            [status, assigned_service, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM reports WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Report;