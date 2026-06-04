
const db = require('../db');

class AuditLog {
    static async add(logData) {
        const { user_id, action, target_type, target_id, details, ip_address } = logData;
        const [result] = await db.query(
            'INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, action, target_type, target_id, details, ip_address]
        );
        return result.insertId;
    }

    static async findAll(limit = 100) {
        const [rows] = await db.query(`
            SELECT a.*, u.name as user_name 
            FROM audit_logs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY a.created_at DESC 
            LIMIT ?`, [limit]);
        return rows;
    }
}

module.exports = AuditLog;
