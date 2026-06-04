const db = require('../db');

class Council {
    // --- Members ---
    static async getMembers() {
        const [rows] = await db.query('SELECT * FROM council_members');
        return rows;
    }

    static async addMember(data) {
        const { name, role, image, commission } = data;
        const [result] = await db.query(
            'INSERT INTO council_members (name, role, image, commission) VALUES (?, ?, ?, ?)',
            [name, role, image, commission]
        );
        return { id: result.insertId, ...data };
    }

    static async updateMember(id, data) {
        const { name, role, image, commission } = data;
        const [result] = await db.query(
            'UPDATE council_members SET name = ?, role = ?, image = ?, commission = ? WHERE id = ?',
            [name, role, image, commission, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteMember(id) {
        const [result] = await db.query('DELETE FROM council_members WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Sessions ---
    static async getSessions() {
        const [rows] = await db.query('SELECT * FROM council_sessions ORDER BY date DESC');
        return rows;
    }

    static async addSession(data) {
        const { date, title, agenda, status, docUrl } = data;
        const [result] = await db.query(
            'INSERT INTO council_sessions (date, title, agenda, status, docUrl) VALUES (?, ?, ?, ?, ?)',
            [date, title, agenda, status, docUrl]
        );
        return { id: result.insertId, ...data };
    }

    static async updateSession(id, data) {
        const { date, title, agenda, status, docUrl } = data;
        const [result] = await db.query(
            'UPDATE council_sessions SET date = ?, title = ?, agenda = ?, status = ?, docUrl = ? WHERE id = ?',
            [date, title, agenda, status, docUrl, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteSession(id) {
        const [result] = await db.query('DELETE FROM council_sessions WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Council;