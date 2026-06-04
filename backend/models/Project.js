const db = require('../db');

class Project {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        return rows;
    }

    static async getByType(type) {
        const [rows] = await db.query('SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC', [type]);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO projects (${fields.join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(query, values);
        return { id: result.insertId, ...data };
    }

    static async update(id, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE projects SET ${setClause} WHERE id = ?`;
        
        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getStats() {
        try {
            const [rows] = await db.query('SELECT budget, status, progress_pct FROM projects');
            
            let total_budget = 0;
            let completed_count = 0;
            let delayed_count = 0;
            const total_count = rows.length;

            rows.forEach(row => {
                // Parse budget string (e.g. "150 000 000 FCFA")
                if (row.budget) {
                    const numericBudget = parseInt(row.budget.replace(/[^0-9]/g, ''), 10);
                    if (!isNaN(numericBudget)) total_budget += numericBudget;
                }
                
                if (row.status === 'realise') completed_count++;
                if (row.status === 'en_cours' && row.progress_pct < 50) delayed_count++;
            });

            return {
                total_count,
                total_budget,
                completed_count,
                delayed_count
            };
        } catch (error) {
            console.error('Error in getStats:', error);
            // Fallback empty stats instead of crashing
            return { total_count: 0, total_budget: 0, completed_count: 0, delayed_count: 0 };
        }
    }
}

module.exports = Project;
