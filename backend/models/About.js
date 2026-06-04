const db = require('../db');

class About {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM about_sections ORDER BY id ASC');
        return rows;
    }

    static async add(data) {
        const { title, content } = data;
        const [result] = await db.query(
            'INSERT INTO about_sections (title, content) VALUES (?, ?)',
            [title, content]
        );
        return { id: result.insertId, ...data };
    }

    static async update(id, data) {
        const { title, content } = data;
        const [result] = await db.query(
            'UPDATE about_sections SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM about_sections WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = About;
