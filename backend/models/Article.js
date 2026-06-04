const db = require('../db');

class Article {
    static async findAll(limit, offset, category) {
        let query = 'SELECT * FROM articles';
        let countQuery = 'SELECT COUNT(*) as total FROM articles';
        let params = [];
        let countParams = [];

        if (category && category !== 'Tout') {
            query += ' WHERE category = ?';
            countQuery += ' WHERE category = ?';
            params.push(category);
            countParams.push(category);
        }

        query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.query(query, params);
        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        return {
            data: rows,
            meta: {
                total,
                page: (offset / limit) + 1,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(articleData) {
        const { title, category, content, imageUrl, isFeatured } = articleData;
        const date = new Date().toISOString().split('T')[0];
        
        const [result] = await db.query(
            'INSERT INTO articles (title, category, content, imageUrl, date, isFeatured) VALUES (?, ?, ?, ?, ?, ?)',
            [title, category, content, imageUrl, date, isFeatured ? 1 : 0]
        );
        
        return { id: result.insertId, ...articleData, date };
    }

    static async update(id, articleData) {
        const { title, category, content, imageUrl, isFeatured } = articleData;
        
        const [result] = await db.query(
            'UPDATE articles SET title = ?, category = ?, content = ?, imageUrl = ?, isFeatured = ? WHERE id = ?',
            [title, category, content, imageUrl, isFeatured ? 1 : 0, id]
        );
        
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM articles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    
    static async reset() {
        await db.query('TRUNCATE TABLE articles');
        // Optionnel : Re-seed si nécessaire
    }
}

module.exports = Article;