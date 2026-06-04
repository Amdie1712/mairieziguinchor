const db = require('../db');

class Participation {
    static async getProjects() {
        const [rows] = await db.query('SELECT * FROM participation_projects ORDER BY votes_count DESC');
        return rows;
    }

    static async addProject(data) {
        const { title, description, category, author_name, budget_estimate, image_url } = data;
        const [result] = await db.query(
            'INSERT INTO participation_projects (title, description, category, author_name, budget_estimate, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, category, author_name, budget_estimate, image_url, 'Soumis']
        );
        return { id: result.insertId, ...data, status: 'Soumis', votes_count: 0 };
    }

    static async vote(projectId, userId) {
        // Simple vote logic (could be more robust with a join table)
        const [result] = await db.query(
            'UPDATE participation_projects SET votes_count = votes_count + 1 WHERE id = ?',
            [projectId]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE participation_projects SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM participation_projects WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getComments(projectId) {
        const [rows] = await db.query(
            'SELECT * FROM participation_comments WHERE project_id = ? ORDER BY created_at DESC',
            [projectId]
        );
        return rows;
    }

    static async addComment(data) {
        const { project_id, user_id, user_name, comment } = data;
        const [result] = await db.query(
            'INSERT INTO participation_comments (project_id, user_id, user_name, comment) VALUES (?, ?, ?, ?)',
            [project_id, user_id, user_name, comment]
        );
        return { id: result.insertId, ...data, created_at: new Date() };
    }
}

module.exports = Participation;
