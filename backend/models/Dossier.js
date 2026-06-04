
const db = require('../db');

class Dossier {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT 
                d.*, 
                COALESCE(u.name, d.user_name) as user_name, 
                COALESCE(u.email, d.user_email) as user_email 
            FROM dossiers d 
            LEFT JOIN users u ON d.user_id = u.id 
            ORDER BY d.date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM dossiers WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM dossiers WHERE user_id = ? ORDER BY date DESC', [userId]);
        return rows;
    }

    static async create(userId, dossierData) {
        const { type, description, formData, assigned_service, user_name, user_email } = dossierData;
        const readableId = `ZIG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const date = new Date().toISOString().split('T')[0];
        const status = 'EN_ATTENTE'; // Statut initial recommandé

        // Logique de routage automatique par service si non spécifié
        let finalService = assigned_service || 'État Civil';
        const lowerType = type ? type.toLowerCase() : '';
        const lowerDesc = description ? description.toLowerCase() : '';
        const searchPool = lowerType + ' ' + lowerDesc;
        
        if (searchPool.includes('acte de') || searchPool.includes('civil') || searchPool.includes('naissance') || searchPool.includes('mariage')) {
            finalService = 'État Civil';
        } else if (searchPool.includes('ecole') || searchPool.includes('education') || searchPool.includes('formation') || searchPool.includes('stage') || searchPool.includes('emploi') || searchPool.includes('volontaire')) {
            finalService = 'Éducation, Alphabétisation et Formation';
        } else if (searchPool.includes('spectacle') || searchPool.includes('culture') || searchPool.includes('sport') || searchPool.includes('jeunesse') || searchPool.includes('loisir')) {
            finalService = 'Jeunesse, Sport, Loisirs et Culture';
        } else if (searchPool.includes('place') || searchPool.includes('espace') || searchPool.includes('assainissement') || searchPool.includes('marche') || searchPool.includes('équipement')) {
            finalService = 'Assainissement, Cadre de vie, Équipement Marchands';
        } else if (searchPool.includes('social') || searchPool.includes('aide') || searchPool.includes('subvention') || searchPool.includes('sante') || searchPool.includes('hopital')) {
            finalService = 'Santé et Action Sociale';
        } else if (searchPool.includes('voirie') || searchPool.includes('eclairage') || searchPool.includes('route') || searchPool.includes('lampe')) {
            finalService = 'Voirie et Éclairage Public';
        } else if (searchPool.includes('quartier') || searchPool.includes('gouvernance') || searchPool.includes('organisation')) {
            finalService = 'Gouvernance et Organisation des Quartiers';
        }

        await db.query(
            'INSERT INTO dossiers (id, user_id, user_name, user_email, type, description, date, status, form_data, assigned_service) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [readableId, userId, user_name || null, user_email || null, type, description, date, status, JSON.stringify(formData || {}), finalService]
        );

        return { id: readableId, user_id: userId, user_name, user_email, type, description, date, status, assigned_service: finalService };
    }

    static async updateStatus(id, status, comment = '') {
        const [result] = await db.query('UPDATE dossiers SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async treat(id, data) {
        const { status, assigned_service, internal_notes, service_feedback } = data;
        const [result] = await db.query(
            'UPDATE dossiers SET status = ?, assigned_service = ?, internal_notes = ?, service_feedback = ? WHERE id = ?',
            [status, assigned_service, internal_notes, service_feedback, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM dossiers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Dossier;
