const db = require('../db');

class Content {
    // --- Services ---
    static async getServices() {
        const [rows] = await db.query('SELECT * FROM services');
        return rows;
    }

    static async addService(data) {
        const { title, description, icon, action, link, address, category, latitude, longitude } = data;
        const [result] = await db.query(
            'INSERT INTO services (title, description, icon, action, link, address, category, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, icon || 'FileText', action || 'En savoir plus', link, address, category, latitude, longitude]
        );
        return { id: result.insertId, ...data };
    }

    static async updateService(id, data) {
        const { title, description, icon, action, link, address, category, latitude, longitude } = data;
        const [result] = await db.query(
            'UPDATE services SET title = ?, description = ?, icon = ?, action = ?, link = ?, address = ?, category = ?, latitude = ?, longitude = ? WHERE id = ?',
            [title, description, icon, action, link, address, category, latitude, longitude, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteService(id) {
        const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Documents ---
    static async getDocuments() {
        const [rows] = await db.query('SELECT id, name, description, date, type, size, category, file_url as fileUrl FROM documents ORDER BY id DESC');
        return rows;
    }

    static async addDocument(data) {
        const { name, description, date, type, size, category, fileUrl } = data;
        const [result] = await db.query(
            'INSERT INTO documents (name, description, date, type, size, category, file_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, date, type, size, category, fileUrl]
        );
        return { id: result.insertId, ...data };
    }

    static async updateDocument(id, data) {
        const { name, description, date, type, size, category, fileUrl } = data;
        const [result] = await db.query(
            'UPDATE documents SET name = ?, description = ?, date = ?, type = ?, size = ?, category = ?, file_url = ? WHERE id = ?',
            [name, description, date, type, size, category, fileUrl, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteDocument(id) {
        const [result] = await db.query('DELETE FROM documents WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Procedures ---
    static async getProcedures() {
        const [rows] = await db.query('SELECT id, title, description, icon, category, delay, isOnline, dossierType, required_docs as requiredDocs FROM procedures_list');
        return rows.map(r => ({
            ...r,
            requiredDocs: r.requiredDocs ? r.requiredDocs.split(',') : []
        }));
    }

    static async addProcedure(data) {
        const { title, description, icon, category, delay, isOnline, dossierType, requiredDocs } = data;
        const reqDocsStr = Array.isArray(requiredDocs) ? requiredDocs.join(',') : '';
        const [result] = await db.query(
            'INSERT INTO procedures_list (title, description, icon, category, delay, isOnline, dossierType, required_docs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, icon, category, delay, isOnline ? 1 : 0, dossierType, reqDocsStr]
        );
        return { id: result.insertId, ...data };
    }

    static async updateProcedure(id, data) {
        const { title, description, icon, category, delay, isOnline, dossierType, requiredDocs } = data;
        const reqDocsStr = Array.isArray(requiredDocs) ? requiredDocs.join(',') : '';
        const [result] = await db.query(
            'UPDATE procedures_list SET title = ?, description = ?, icon = ?, category = ?, delay = ?, isOnline = ?, dossierType = ?, required_docs = ? WHERE id = ?',
            [title, description, icon, category, delay, isOnline ? 1 : 0, dossierType, reqDocsStr, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteProcedure(id) {
        const [result] = await db.query('DELETE FROM procedures_list WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Projects ---
    static async getProjects() {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY id DESC');
        return rows;
    }

    static async addProject(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO projects (${fields.join(', ')}) VALUES (${placeholders})`;
        
        const [result] = await db.query(query, values);
        return { id: result.insertId, ...data };
    }

    static async updateProject(id, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE projects SET ${setClause} WHERE id = ?`;
        
        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows > 0;
    }

    static async deleteProject(id) {
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Neighborhoods ---
    static async getNeighborhoods() {
        const [rows] = await db.query('SELECT * FROM neighborhoods');
        return rows;
    }

    static async addNeighborhood(data) {
        const { name, representative, nextMeeting, location, description, image, reports_url, contact_email, latitude, longitude } = data;
        const [result] = await db.query(
            'INSERT INTO neighborhoods (name, representative, nextMeeting, location, description, image, reports_url, contact_email, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, representative, nextMeeting, location, description, image || null, reports_url || null, contact_email || null, latitude, longitude]
        );
        return { id: result.insertId, ...data };
    }

    static async updateNeighborhood(id, data) {
        const { name, representative, nextMeeting, location, description, image, reports_url, contact_email, latitude, longitude } = data;
        const [result] = await db.query(
            'UPDATE neighborhoods SET name = ?, representative = ?, nextMeeting = ?, location = ?, description = ?, image = ?, reports_url = ?, contact_email = ?, latitude = ?, longitude = ? WHERE id = ?',
            [name, representative, nextMeeting, location, description, image || null, reports_url || null, contact_email || null, latitude, longitude, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteNeighborhood(id) {
        const [result] = await db.query('DELETE FROM neighborhoods WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- About ---
    static async getAbout() {
        try {
            const [rows] = await db.query('SELECT * FROM about_sections');
            return rows;
        } catch (e) {
            console.warn("Table about_sections might not exist", e);
            return [];
        }
    }

    static async createAbout(data) {
        const { title, content } = data;
        const [result] = await db.query(
            'INSERT INTO about_sections (title, content) VALUES (?, ?)',
            [title, content]
        );
        return { id: result.insertId, ...data };
    }

    static async updateAbout(id, data) {
        const { title, content } = data;
        const [result] = await db.query(
            'UPDATE about_sections SET title = ?, content = ? WHERE id = ?', 
            [title, content, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteAbout(id) {
        const [result] = await db.query('DELETE FROM about_sections WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- About Stats ---
    static async getAboutStats() {
        const [rows] = await db.query('SELECT * FROM about_stats');
        return rows;
    }

    static async addAboutStat(data) {
        const { label, value, icon } = data;
        const [result] = await db.query(
            'INSERT INTO about_stats (label, value, icon) VALUES (?, ?, ?)',
            [label, value, icon]
        );
        return { id: result.insertId, ...data };
    }

    static async updateAboutStat(id, data) {
        const { label, value, icon } = data;
        const [result] = await db.query(
            'UPDATE about_stats SET label = ?, value = ?, icon = ? WHERE id = ?',
            [label, value, icon, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteAboutStat(id) {
        const [result] = await db.query('DELETE FROM about_stats WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // --- Images ---
    static async getImages() {
        const [rows] = await db.query('SELECT * FROM images ORDER BY id DESC');
        return rows;
    }

    static async addImage(data) {
        const { title, url, category } = data;
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
        
        try {
            const [result] = await db.query(
                'INSERT INTO images (name, url, category, date) VALUES (?, ?, ?, ?)',
                [title || 'Sans titre', url || '', category || 'Général', formattedDate]
            );
            return { id: result.insertId, ...data, date: formattedDate };
        } catch (err) {
            console.error('Database Error in addImage:', err);
            throw err;
        }
    }

    static async deleteImage(id) {
        const [result] = await db.query('DELETE FROM images WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getSystemImages() {
        const [rows] = await db.query('SELECT * FROM system_images');
        const map = {};
        rows.forEach(r => map[r.image_key] = r.url);
        return map;
    }

    static async setSystemImage(key, url) {
        // Upsert logic
        const [rows] = await db.query('SELECT * FROM system_images WHERE image_key = ?', [key]);
        if (rows.length > 0) {
            await db.query('UPDATE system_images SET url = ? WHERE image_key = ?', [url, key]);
        } else {
            await db.query('INSERT INTO system_images (image_key, url) VALUES (?, ?)', [key, url]);
        }
        return true;
    }

    static async seedData() {
        const connection = await db.getConnection();
        try {
            // Seed Services
            await connection.query('DELETE FROM services');
            await connection.query(`
                INSERT INTO services (title, description, icon, link, address, category, latitude, longitude) VALUES
                ('Hôtel de Ville', 'Siège principal de la municipalité et bureaux du Maire.', 'Building', '/about', 'Rue du Général de Gaulle', 'Administration', 12.5859, -16.2729),
                ('Ancienne Mairie', 'Bâtiment historique abritant certains services administratifs.', 'Building', '/about', 'Quartier Escale', 'Administration', 12.5870, -16.2740),
                ('Perception Municipale', 'Service en charge des recettes et du trésor communal.', 'Wallet', '/about', 'Centre-ville', 'Finance', 12.5850, -16.2715),
                ('Centre secondaire d’état civil', 'Antenne de proximité pour les actes civils.', 'FileText', '/demarches', 'Kandé', 'État Civil', 12.5780, -16.2820),
                ('Services Techniques', 'Direction de la voirie, de l’urbanisme et de l’assainissement.', 'Tool', '/demarches', 'Zone industrielle', 'Technique', 12.5950, -16.2650),
                ('Direction de l’Éducation', 'Appui aux établissements scolaires et à la formation des citoyens.', 'School', '/demarches', 'Plateau', 'Éducation', 12.5847, -16.2730),
                ('Centre Social communal', 'Accompagnement social et sanitaire des populations vulnérables.', 'Heart', '/demarches', 'Boucoutte', 'Social', 12.5700, -16.2600),
                ('Centre Culturel régional', 'Promotion des activités sportives, culturelles et de loisirs.', 'Palette', '/demarches', 'Quartier Latin', 'Culture', 12.5830, -16.2715)
            `);

            // Seed Procedures
            await connection.query('DELETE FROM procedures_list');
            const allProcedures = [
                // État Civil
                ['Demande d\'acte de naissance', 'Demande d\'acte de naissance officiel.', 'Baby', 'État Civil', '48h', 1, 'Demande d\'acte de naissance', 'Pièce d\'identité des parents, Livret de famille'],
                ['Copie littérale', 'Demande de copie littérale d\'acte de naissance.', 'FileText', 'État Civil', '48h', 1, 'Copie littérale', 'Livret de famille, Pièce d\'identité'],
                ['Extrait de naissance', 'Extrait d\'acte de naissance rapide.', 'Baby', 'État Civil', '48h', 1, 'Extrait de naissance', 'Pièce d\'identité'],
                ['Acte de mariage', 'Demande d\'acte de mariage officiel.', 'Heart', 'État Civil', '48h', 1, 'Acte de mariage', 'Livret de famille, Pièces d\'identité des époux'],
                ['Acte de décès', 'Demande d\'acte de décès.', 'Skull', 'État Civil', '48h', 1, 'Acte de décès', 'Certificat de décès médical, Pièce d\'identité du déclarant'],
                ['Légalisation de documents', 'Légalisation de signatures et copies conformes.', 'Stamp', 'État Civil', 'Immédiat', 1, 'Légalisation', 'Document original, Pièce d\'identité'],
                ['Certificat de résidence', 'Justificatif de domicile officiel.', 'Home', 'État Civil', '24h', 1, 'Certificat de résidence', 'Facture Senelec/SNDE ou certificat d\'hébergement, Pièce d\'identité'],
                ['Déclaration de naissance', 'Enregistrement d\'une nouvelle naissance.', 'Baby', 'État Civil', 'Immédiat', 1, 'Déclaration de naissance', 'Certificat d\'accouchement, Pièces d\'identité des parents, Livret de famille'],
                ['Prise de rendez-vous', 'Prendre RDV avec un officier d\'état civil.', 'Calendar', 'État Civil', 'Immédiat', 1, 'Rendez-vous', 'Aucun document requis pour la prise de RDV'],

                // Assainissement, Cadre de Vie & Équipements Marchands
                ['Collecte des déchets', 'Signalement ou demande de collecte spécifique.', 'Trash2', 'Assainissement, Cadre de Vie & Équipements Marchands', '48h', 1, 'Collecte déchets', 'Description des déchets, Photos (optionnel)'],
                ['Nettoyage des quartiers', 'Demande d\'intervention de nettoyage dans un quartier.', 'Sparkles', 'Assainissement, Cadre de Vie & Équipements Marchands', '7 jours', 1, 'Nettoyage quartier', 'Lettre de demande du conseil de quartier'],
                ['Gestion des marchés municipaux', 'Informations et démarches relatives aux marchés.', 'Store', 'Assainissement, Cadre de Vie & Équipements Marchands', '7 jours', 1, 'Marchés', 'Pièce d\'identité, Justificatif de domicile'],
                ['Attribution de places dans les marchés', 'Demande d\'emplacement commercial dans un marché.', 'MapPin', 'Assainissement, Cadre de Vie & Équipements Marchands', '15 jours', 1, 'Place marché', 'Pièce d\'identité, Certificat de résidence, Registre de commerce'],
                ['Occupation de l’espace public', 'Demande d\'autorisation temporaire d\'occupation.', 'HardHat', 'Assainissement, Cadre de Vie & Équipements Marchands', '15 jours', 1, 'Occupation espace public', 'Plan de l\'occupation, Descriptif, Assurance'],
                ['Signalement d’insalubrité', 'Signaler un problème d\'hygiène ou d\'insalubrité.', 'AlertTriangle', 'Assainissement, Cadre de Vie & Équipements Marchands', '48h', 1, 'Signalement insalubrité', 'Photos du site, Localisation précise'],
                ['Hygiène publique', 'Contrôles sanitaires et hygiène.', 'Activity', 'Assainissement, Cadre de Vie & Équipements Marchands', '48h', 1, 'Hygiène', 'Demande de contrôle'],
                ['Gestion des équipements marchands', 'Suivi et maintenance des infrastructures marchandes.', 'Store', 'Assainissement, Cadre de Vie & Équipements Marchands', 'Variable', 1, 'Équipements marchands', 'Identifiant commerçant'],

                // Voirie & Éclairage Public
                ['Réparation des routes', 'Signalement urgent pour entretien routier.', 'Construction', 'Voirie & Éclairage Public', 'Variable', 1, 'Réparation route', 'Localisation précise, Photos'],
                ['Signalement des nids-de-poule', 'Signaler une dégradation de la chaussée.', 'AlertCircle', 'Voirie & Éclairage Public', '48h', 1, 'Nids-de-poule', 'Localisation précise, Photos'],
                ['Maintenance des lampadaires', 'Signaler une panne d\'éclairage public.', 'Tablets', 'Voirie & Éclairage Public', '48h', 1, 'Maintenance éclairage', 'Numéro du point lumineux ou rue'],
                ['Construction de caniveaux', 'Demande d\'aménagement de drainage.', 'Droplets', 'Voirie & Éclairage Public', 'Variable', 1, 'Caniveaux', 'Plan de situation, Lettre de demande'],
                ['Urbanisme communal', 'Consultation des plans et règles d\'urbanisme.', 'Map', 'Voirie & Éclairage Public', '15 jours', 1, 'Urbanisme', 'Référence cadastrale'],
                ['Occupation temporaire de voirie', 'Autorisation de travaux sur la voie publique.', 'HardHat', 'Voirie & Éclairage Public', '7 jours', 1, 'Travaux voirie', 'Plan de signalisation, Arrêté de circulation'],
                ['Travaux publics municipaux', 'Informations sur les chantiers en cours.', 'Construction', 'Voirie & Éclairage Public', 'Variable', 1, 'Travaux publics', 'Aucun'],

                // Éducation, Alphabétisation & Formation
                ['Appui aux écoles', 'Demande de matériel ou travaux pour une école.', 'School', 'Éducation, Alphabétisation & Formation', 'Variable', 1, 'Appui écoles', 'Rapport technique, Devis estimatif'],
                ['Bourses municipales', 'Demande d\'aide financière pour les études.', 'GraduationCap', 'Éducation, Alphabétisation & Formation', '1 mois', 1, 'Bourses', 'Certificat d\'inscription, Relevés de notes, Certificat d\'indigence'],
                ['Formation professionnelle', 'Inscriptions aux modules de formation communaux.', 'BookOpen', 'Éducation, Alphabétisation & Formation', 'Variable', 1, 'Formation', 'Pièce d\'identité, Copie du dernier diplôme'],
                ['Alphabétisation', 'Programmes d\'alphabétisation pour adultes.', 'Book', 'Éducation, Alphabétisation & Formation', 'Variable', 1, 'Alphabétisation', 'Pièce d\'identité'],
                ['Gestion des écoles communautaires', 'Suivi des établissements de proximité.', 'School', 'Éducation, Alphabétisation & Formation', 'Variable', 1, 'Écoles communautaires', 'Documents administratifs de l\'école'],
                ['Accompagnement des étudiants', 'Aide aux démarches universitaires.', 'GraduationCap', 'Éducation, Alphabétisation & Formation', 'Variable', 1, 'Accompagnement étudiants', 'Certificat de scolarité'],
                ['Bibliothèque municipale', 'Inscription et services de lecture publique.', 'Library', 'Éducation, Alphabétisation & Formation', 'Immédiat', 1, 'Bibliothèque', 'Photo d\'identité, Justificatif de domicile'],

                // Santé & Action Sociale
                ['Aide sociale', 'Demande d\'aide ponctuelle pour familles démunies.', 'HeartHandshake', 'Santé & Action Sociale', '15 jours', 1, 'Aide sociale', 'Certificat d\'indigence, Pièce d\'identité, Justificatif de domicile'],
                ['Assistance médicale', 'Orientation et aide aux soins de santé.', 'Stethoscope', 'Santé & Action Sociale', 'Variable', 1, 'Assistance médicale', 'Certificat médical, Ordonnance (pour prise en charge)'],
                ['Soutien aux personnes vulnérables', 'Programmes d\'inclusion et d\'aide.', 'Heart', 'Santé & Action Sociale', 'Variable', 1, 'Soutien vulnérables', 'Certificat de handicap ou social'],
                ['Appui aux femmes et enfants', 'Protection et promotion des droits.', 'Users', 'Santé & Action Sociale', 'Variable', 1, 'Appui femmes enfants', 'Aucun'],
                ['Programmes sociaux', 'Accès aux divers soutiens de la commune.', 'LayoutList', 'Santé & Action Sociale', 'Variable', 1, 'Programmes sociaux', 'Dossier social'],
                ['Prise en charge d’urgence', 'Assistance immédiate pour situations critiques.', 'AlertCircle', 'Santé & Action Sociale', 'Immédiat', 1, 'Urgence', 'Preuve du sinistre ou urgence'],
                ['Sensibilisation sanitaire', 'Ateliers de prévention santé.', 'ShieldCheck', 'Santé & Action Sociale', 'Variable', 1, 'Sensibilisation', 'Aucun'],

                // Jeunesse, Sport, Loisirs & Culture
                ['Gestion des terrains sportifs', 'Réservation d\'infrastructures sportives.', 'Trophy', 'Jeunesse, Sport, Loisirs & Culture', '48h', 1, 'Terrains sportifs', 'Lettre de demande, Statuts de l\'association'],
                ['Activités culturelles', 'Agenda et participation aux événements.', 'Palette', 'Jeunesse, Sport, Loisirs & Culture', 'Immédiat', 1, 'Culture', 'Aucun'],
                ['Soutien aux associations', 'Demande de subvention ou de matériel.', 'Users', 'Jeunesse, Sport, Loisirs & Culture', '1 mois', 1, 'Subvention asso', 'Récépissé de l\'association, Rapport d\'activité, RIB'],
                ['Événements municipaux', 'Organisation et participation aux festivités.', 'Calendar', 'Jeunesse, Sport, Loisirs & Culture', 'Variable', 1, 'Événements', 'Demande de participation'],
                ['Maison des jeunes', 'Accès aux services de la structure.', 'Home', 'Jeunesse, Sport, Loisirs & Culture', 'Immédiat', 1, 'Maison jeunes', 'Carte de membre'],
                ['Bibliothèque et culture', 'Services culturels de proximité.', 'Book', 'Jeunesse, Sport, Loisirs & Culture', 'Immédiat', 1, 'Bibliothèque culture', 'Aucun'],
                ['Manifestations sportives', 'Déclaration ou demande d\'appui événementiel.', 'Trophy', 'Jeunesse, Sport, Loisirs & Culture', '15 jours', 1, 'Sport', 'Dossier technique de la manifestation'],

                // Gouvernance & Organisation des Quartiers
                ['Gestion des quartiers', 'Coordination et administration locale.', 'LayoutList', 'Gouvernance & Organisation des Quartiers', 'Variable', 1, 'Gestion quartiers', 'PV de réunion du quartier'],
                ['Participation citoyenne', 'Donnez votre avis sur les projets de la ville.', 'Megaphone', 'Gouvernance & Organisation des Quartiers', 'Immédiat', 1, 'Participation', 'Aucun'],
                ['Réclamations citoyennes', 'Formulez une plainte ou une observation.', 'MessageSquare', 'Gouvernance & Organisation des Quartiers', '7 jours', 1, 'Réclamations', 'Description du litige'],
                ['Médiation sociale', 'Aide au règlement des conflits de voisinage.', 'HeartHandshake', 'Gouvernance & Organisation des Quartiers', '7 jours', 1, 'Médiation', 'Aucun'],
                ['Conseils de quartier', 'Informations sur les réunions de quartier.', 'LayoutList', 'Gouvernance & Organisation des Quartiers', 'Immédiat', 1, 'Conseils quartier', 'Aucun'],
                ['Informations administratives', 'Renseignements sur les services de la mairie.', 'Info', 'Gouvernance & Organisation des Quartiers', 'Immédiat', 1, 'Infos', 'Aucun'],
                ['Démarches communautaires', 'Appui aux initiatives de base.', 'Users', 'Gouvernance & Organisation des Quartiers', 'Variable', 1, 'Démarches quartier', 'Projet communautaire rédigé']
            ];
            await connection.query(
                'INSERT INTO procedures_list (title, description, icon, category, delay, isOnline, dossierType, required_docs) VALUES ?',
                [allProcedures]
            );
            return true;
        } finally {
            connection.release();
        }
    }
}

module.exports = Content;