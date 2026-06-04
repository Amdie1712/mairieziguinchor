const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mairie_ziguinchor',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(async connection => {
        console.log('✅ Connecté à la base de données MySQL');
        
        // Auto-migration for new items
        try {
            const addColumn = async (table, column, definition) => {
                const [cols] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
                if (cols.length === 0) {
                    await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
                    console.log(`✅ Colonne ${column} ajoutée à ${table}`);
                }
            };

            const ensureTable = async (name, schema) => {
                await connection.query(`CREATE TABLE IF NOT EXISTS ${name} ${schema}`);
            };


            const safeMigrate = async (fn) => {
                try { await fn(); } catch (e) { console.warn('Migration step failed:', e.message); }
            };

            await safeMigrate(() => addColumn('users', 'assigned_service', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('users', 'status', "VARCHAR(50) DEFAULT 'actif'"));
            await safeMigrate(() => addColumn('reports', 'assigned_service', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('dossiers', 'assigned_service', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('dossiers', 'internal_notes', 'TEXT'));
            await safeMigrate(() => addColumn('dossiers', 'service_feedback', 'TEXT'));
            await safeMigrate(() => addColumn('dossiers', 'user_name', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('dossiers', 'user_email', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('dossiers', 'form_data', 'LONGTEXT'));

            // Create Audit Logs Table
            await ensureTable('audit_logs', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(255) NOT NULL,
                target_type VARCHAR(100),
                target_id VARCHAR(100),
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )`);

            // Create Site Settings Table
            await ensureTable('site_settings', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                setting_group VARCHAR(50) DEFAULT 'general',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);
            
            // Seed Settings if empty
            await safeMigrate(async () => {
                const [settingRows] = await connection.query('SELECT COUNT(*) as count FROM site_settings');
                if (settingRows[0].count === 0) {
                     await connection.query(`
                        INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
                        ('contact_address', 'Rue du Général de Gaulle, Ziguinchor, Sénégal', 'contact'),
                        ('contact_phone', '+221 33 991 12 34', 'contact'),
                        ('contact_email', 'contact@mairie-ziguinchor.sn', 'contact'),
                        ('maintenance_mode', 'false', 'general'),
                        ('enable_chat', 'true', 'general'),
                        ('footer_text', '© 2024 Mairie de Ziguinchor - Tous droits réservés', 'general'),
                        ('map_lat', '12.5859', 'location'),
                        ('map_lng', '-16.2729', 'location')
                    `);
                }
            });

            // Create Participation Comments Table
            await ensureTable('participation_comments', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                user_id INT,
                user_name VARCHAR(100) NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES participation_projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )`);

            // Check if column exists in participation_projects
            await safeMigrate(() => addColumn('participation_projects', 'status', "VARCHAR(50) DEFAULT 'En attente'"));
            await ensureTable('dossiers', `(
                id VARCHAR(255) PRIMARY KEY,
                user_id INT,
                user_name VARCHAR(255),
                user_email VARCHAR(255),
                type VARCHAR(255) NOT NULL,
                description TEXT,
                date DATE,
                status VARCHAR(50) DEFAULT 'EN_ATTENTE',
                assigned_service VARCHAR(255),
                internal_notes TEXT,
                service_feedback TEXT,
                form_data LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);

            await safeMigrate(() => addColumn('documents', 'description', 'TEXT'));
            await safeMigrate(() => addColumn('documents', 'date', 'DATE'));
            await safeMigrate(() => addColumn('council_sessions', 'agenda', 'TEXT'));

            // Projects table migrations (matching user request)
            await safeMigrate(() => addColumn('projects', 'category', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('projects', 'budget', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('projects', 'location_name', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('projects', 'progress_pct', 'INT DEFAULT 0'));
            await safeMigrate(() => addColumn('projects', 'image_url', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'completion_date', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('projects', 'partners', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'results', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'photo_before', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'photo_after', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'studies_in_progress', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'future_investments', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'planned_calendar', 'TEXT'));
            await safeMigrate(() => addColumn('projects', 'latitude', 'DECIMAL(10,8)'));
            await safeMigrate(() => addColumn('projects', 'longitude', 'DECIMAL(11,8)'));
            await safeMigrate(() => addColumn('projects', 'video_url', 'TEXT'));

            // Services table migrations
            await safeMigrate(() => addColumn('services', 'address', 'VARCHAR(255)'));
            await safeMigrate(() => addColumn('services', 'latitude', 'DECIMAL(10,8)'));
            await safeMigrate(() => addColumn('services', 'longitude', 'DECIMAL(11,8)'));
            await safeMigrate(() => addColumn('services', 'category', 'VARCHAR(255)'));

            // Seed Documents if empty
            await safeMigrate(async () => {
                const [docRows] = await connection.query('SELECT COUNT(*) as count FROM documents');
                if (docRows[0].count === 0) {
                    console.log('🌱 Seeding documents data...');
                    await connection.query(`
                        INSERT INTO documents (name, description, date, type, size, category, file_url) VALUES
                        ('Budget Primitif 2024', 'Document complet détaillant les prévisions de recettes et de dépenses pour l\\'année en cours.', CURDATE(), 'PDF', '2.4 Mo', 'Finance', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                        ('Plan Local d\\'Urbanisme (PLU)', 'Réglementation relative à l\\'occupation des sols et aux constructions sur le territoire de Ziguinchor.', CURDATE(), 'PDF', '5.1 Mo', 'Urbanisme', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                        ('Arrêté - Circulation Centre-Ville', 'Nouvelles dispositions concernant le stationnement et le sens de circulation.', CURDATE(), 'PDF', '0.8 Mo', 'Arrêtés', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                        ('Délibération - Travaux Voirie', 'Compte-rendu de la séance du conseil portant sur la rénovation des axes principaux.', CURDATE(), 'PDF', '1.2 Mo', 'Délibérations', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                        ('Guide Pratique du Citoyen', 'Toutes les informations utiles pour vos démarches en mairie.', CURDATE(), 'PDF', '3.5 Mo', 'Archives', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
                    `);
                }
            });

            // Create Services Table
            await ensureTable('services', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon VARCHAR(100),
                address VARCHAR(255),
                category VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                action VARCHAR(100) DEFAULT 'En savoir plus',
                link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Seed Services if empty
            await connection.query('DELETE FROM services'); // Force re-seed with correct data
            console.log('🌱 Seeding services data...');
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

            // Create Participation Table
            await ensureTable('participation_projects', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100),
                author_name VARCHAR(255),
                budget_estimate VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Soumis',
                votes_count INT DEFAULT 0,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Check/Create Projects Table
            await ensureTable('projects', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(255),
                status VARCHAR(100),
                color VARCHAR(100),
                category VARCHAR(255),
                budget VARCHAR(255),
                location_name VARCHAR(255),
                progress_pct INT DEFAULT 0,
                image_url TEXT,
                completion_date VARCHAR(255),
                partners TEXT,
                results TEXT,
                photo_before TEXT,
                photo_after TEXT,
                studies_in_progress TEXT,
                future_investments TEXT,
                planned_calendar TEXT,
                latitude DECIMAL(10,8),
                longitude DECIMAL(11,8),
                video_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Create Images Table
            await ensureTable('images', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                date DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Create System Images Table
            await ensureTable('system_images', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_key VARCHAR(100) UNIQUE NOT NULL,
                url VARCHAR(255) NOT NULL
            )`);

            // Create Procedures Table
            await ensureTable('procedures_list', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon VARCHAR(100),
                category VARCHAR(100),
                delay VARCHAR(100),
                isOnline TINYINT(1) DEFAULT 0,
                dossierType VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            await safeMigrate(() => addColumn('procedures_list', 'required_docs', 'TEXT'));

            // Cleanup: Remove the procedure we replaced
            await connection.query("DELETE FROM procedures_list WHERE title = 'Inscription scolaire'");
            // Cleanup: Remove duplicate services if any
            await connection.query("DELETE FROM services WHERE id > 8");
            
            // Try to migrate data from municipal_projects if it exists
            try {
                const [mProjects] = await connection.query("SELECT * FROM municipal_projects");
                if (mProjects.length > 0) {
                    console.log('📦 Migrating data from municipal_projects to projects...');
                    for (const p of mProjects) {
                        const [existing] = await connection.query("SELECT * FROM projects WHERE title = ?", [p.title]);
                        if (existing.length === 0) {
                            await connection.query(
                                "INSERT INTO projects (category, title, description, budget, location_name, status, progress_pct, image_url, latitude, longitude, partners) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [p.category, p.title, p.description, p.budget, p.location_name, p.status, p.progress_pct, p.image_url, p.latitude, p.longitude, p.partners]
                            );
                        }
                    }
                }
            } catch (e) {
                // table municipal_projects might not exist, ignore
            }
            
            // Clean and Re-seed Procedures
            console.log('🔄 DELETING old procedures...');
            await connection.query('DELETE FROM procedures_list');
            
            const allProcedures = [
                ['Demande d\'Acte de Naissance', 'Copie intégrale ou extrait avec ou sans filiation.', 'Baby', 'État Civil', '48h', 1, 'Demande d\'Acte de Naissance', 'Pièce d\'identité des parents, Livret de famille'],
                ['Demande d\'Acte de Mariage', 'Copie intégrale ou extrait plurilingue.', 'Heart', 'État Civil', '48h', 1, 'Demande d\'Acte de Mariage', 'Livret de famille, Pièces d\'identité des époux'],
                ['Demande d\'Acte de Décès', 'Copie intégrale d\'acte de décès survenu sur la commune.', 'Skull', 'État Civil', '48h', 1, 'Demande d\'Acte de Décès', 'Certificat de décès médical, Pièce d\'identité du déclarant'],
                ['Renouvellement CNI', 'Démarche pour le renouvellement de la carte nationale d\'identité.', 'UserCheck', 'Identité', '15 jours', 1, 'Carte d\'identité', 'Ancienne CNI, Certificat de résidence, 2 photos d\'identité, Timbre fiscal'],
                ['Passeport Biométrique', 'Première demande ou renouvellement de passeport.', 'UserCheck', 'Identité', '10 jours', 1, 'Passeport', 'Extrait de naissance de moins de 3 mois, CNI, Certificat de résidence, 4 photos, Timbre fiscal'],
                ['Certificat de Résidence', 'Attestation de domicile pour vos démarches administratives.', 'FileText', 'Identité', '48h', 1, 'Résidence', 'Facture Senelec/SNDE ou certificat d\'hébergement, Pièce d\'identité'],
                ['Inscription Cantine Scolaire', 'Inscription annuelle ou modification du compte cantine.', 'Apple', 'Famille', '48h', 1, 'Cantine scolaire', 'Justificatif de domicile, Attestation de paiement des taxes municipales'],
                ['Inscription Crèche municipale', 'Dépôt de dossier pour une place en structure multi-accueil.', 'Baby', 'Famille', 'Variable', 1, 'Crèche', 'Extrait de naissance de l\'enfant, Carnet de santé, Justificatif de revenus'],
                ['Transport Scolaire', 'Demande de carte de transport pour les élèves de la ville.', 'Truck', 'Famille', '7 jours', 1, 'Transport scolaire', 'Photo d\'identité, Certificat de scolarité, Justificatif de domicile'],
                ['Permis de construire', 'Demande d\'autorisation pour travaux de construction.', 'Home', 'Urbanisme', '2 mois', 1, 'Permis Construire', 'Plan de situation, Plan de masse, Titre de propriété, Plans d\'architecte'],
                ['Certificat d\'Urbanisme', 'Information sur les droits et règles d\'urbanisme d\'un terrain.', 'Map', 'Urbanisme', '1 mois', 1, 'Urbanisme', 'Plan de situation, Extrait de plan cadastral'],
                ['Occupation du Domaine Public', 'Terrasses, échafaudages ou déménagement.', 'HardHat', 'Cadre de vie', '15 jours', 1, 'Occupation Domaine', 'Plan de l\'occupation, Descriptif des installations, Assurance responsabilité civile'],
                ['Signalement Voirie', 'Signalez un nid-de-poule ou un lampadaire en panne.', 'AlertTriangle', 'Cadre de vie', '48h', 1, 'Signalement', 'Description précise, Photos du problème (optionnel)'],
                ['Carte de Commerçant', 'Identification professionnelle pour les commerçants locaux.', 'Briefcase', 'Professionnels', '7 jours', 1, 'Commerce', 'Registre du commerce, NINEA, Pièce d\'identité, Photos'],
                ['Rejoindre le réseau Entreprises', 'Inscrivez votre société à l\'annuaire municipal.', 'Building2', 'Professionnels', '48h', 1, 'Rejoindre le réseau Entreprises', 'Fiche NINEA, Logo de l\'entreprise, Descriptif des services'],
                ['Licence de Débit de Boisson', 'Installation ou transfert d\'une licence 3 ou 4.', 'Coffee', 'Professionnels', '1 mois', 1, 'Licence Boisson', 'Casier judiciaire, Bail commercial, Plan des locaux'],
                ['Candidature Spontanée (Emploi)', 'Proposez vos compétences à la Ville de Ziguinchor.', 'UserPlus', 'Emploi & RH', '30 jours', 1, 'Demande d\'Emploi', 'Curriculum Vitae (CV), Lettre de motivation, Copies des diplômes'],
                ['Demande de Stage', 'Effectuez votre stage scolaire ou universitaire en mairie.', 'GraduationCap', 'Emploi & RH', '15 jours', 1, 'Demande de Stage', 'Convention de stage, CV, Lettre de motivation'],
                ['Devenir Volontaire', 'Participez aux grands événements de la ville comme bénévole.', 'Users', 'Emploi & RH', '7 jours', 1, 'Devenir Volontaire', 'Pièce d\'identité, Formulaire de volontariat dûment rempli'],
                ['Demande de Subvention', 'Aide financière pour les associations ou familles en difficulté.', 'DollarSign', 'Social', '1 mois', 1, 'Social', 'Statuts de l\'association, Récépissé, Rapport d\'activités, Relevé d\'identité bancaire'],
                ['Aide Sociale (CCAS)', 'Dépôt de dossier d\'aide alimentaire ou accompagnement.', 'HeartHandshake', 'Social', '15 jours', 1, 'Aide Sociale', 'Certificat d\'indigence, Pièce d\'identité, Justificatif de domicile'],
                ['Logement Social', 'Constitution du dossier de demande de logement.', 'Building', 'Social', 'Variable', 1, 'Logement Social', 'Livret de famille, Justificatifs de revenus (3 derniers mois), Pièce d\'identité']
            ];

            console.log('🚀 INSERTING procedures...');
            await connection.query(
                'INSERT INTO procedures_list (title, description, icon, category, delay, isOnline, dossierType, required_docs) VALUES ?',
                [allProcedures]
            );

            console.log(`✨ DONE: ${allProcedures.length} procedures initialized.`);

            // Create Council Members Table
            await ensureTable('council_members', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                commission VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Seed Council Members if empty
            const [memberRowsCheck] = await connection.query('SELECT COUNT(*) as count FROM council_members');
            if (memberRowsCheck[0].count === 0) {
                console.log('🌱 Seeding council members data...');
                await connection.query(`
                    INSERT INTO council_members (name, role, image, commission) VALUES
                    ('Ousmane Sonko', 'Maire de Ziguinchor', 'https://picsum.photos/id/64/300/300', ''),
                    ('Aïda BODIAN', '1ère Adjointe', 'https://picsum.photos/id/65/300/300', 'Chargé des questions pédagogiques et sociales dans l\\'éducation élémentaire'),
                    ('Ndiaga DIEYE', '2ème Adjoint', 'https://picsum.photos/id/66/300/300', 'Chargé des finances et de la coopération'),
                    ('Oulimata SIDIBE', '3ème Adjointe', 'https://picsum.photos/id/67/300/300', 'Chargé des questions pédagogiques et sociales dans l\\'éducation préscolaire'),
                    ('Alassane DIEDHIOU', '4ème Adjoint', 'https://picsum.photos/id/68/300/300', 'Chargé de la santé et de la citoyenneté'),
                    ('Aminata Touré', '5ème Adjointe', 'https://picsum.photos/id/72/300/300', 'Économie locale'),
                    ('Babacar Faye', '6ème Adjoint', 'https://picsum.photos/id/73/300/300', 'Environnement et cadre de vie'),
                    ('Khadidiatou Fall', '7ème Adjointe', 'https://picsum.photos/id/74/300/300', 'Culture et patrimoine'),
                    ('Oumar Sagna', '8ème Adjoint', 'https://picsum.photos/id/75/300/300', 'Éducation et formation'),
                    ('Seynabou Diouf', '9ème Adjointe', 'https://picsum.photos/id/76/300/300', 'Tourisme et artisanat'),
                    ('Abdou Sané', '10ème Adjoint', 'https://picsum.photos/id/77/300/300', 'Sécurité et protection civile'),
                    ('Marianne Bodian', '11ème Adjointe', 'https://picsum.photos/id/78/300/300', 'Marchés Publics'),
                    ('Cheikh Tidiane Diédhiou', '12ème Adjoint', 'https://picsum.photos/id/79/300/300', 'Coopération décentralisée'),
                    ('Ndèye Marie Sy', '13ème Adjointe', 'https://picsum.photos/id/80/300/300', 'Genre et équité'),
                    ('Lamine Diedhiou', '14ème Adjoint', 'https://picsum.photos/id/81/300/300', 'Sports et loisirs'),
                    ('Isatou Badji', '15ème Adjointe', 'https://picsum.photos/id/82/300/300', 'Hygiène et salubrité'),
                    ('Modou Fall', '16ème Adjoint', 'https://picsum.photos/id/83/300/300', 'Commerce et foires'),
                    ('Mariama Sarr', 'Conseillère', 'https://picsum.photos/id/69/300/300', 'Commissions sociales'),
                    ('Abdoulaye Diallo', 'Conseiller', 'https://picsum.photos/id/70/300/300', 'Commissions culturelles'),
                    ('Sophie Badji', 'Conseillère', 'https://picsum.photos/id/71/300/300', 'Commissions environnement')
                `);
            }

            // Create Council Sessions Table
            await ensureTable('council_sessions', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL,
                title VARCHAR(255) NOT NULL,
                agenda TEXT,
                status VARCHAR(50) DEFAULT 'Passé',
                docUrl VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Seed Sessions if empty
            const [sessionRowsCheck] = await connection.query('SELECT COUNT(*) as count FROM council_sessions');
            if (sessionRowsCheck[0].count === 0) {
                console.log('🌱 Seeding council sessions data...');
                await connection.query(`
                    INSERT INTO council_sessions (date, title, agenda, status, docUrl) VALUES
                    ('2026-06-20', 'Séance Ordinaire - Vote du Budget 2024', '1. Approbation du procès-verbal précédent\\n2. Débat d\\'Orientation Budgétaire (DOB) 2024\\n3. Vote des taux des taxes locales\\n4. Plan de Modernisation de l\\'éclairage public\\n5. Subventions aux associations\\n6. Questions diverses', 'A venir', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                    ('2025-12-15', 'Séance Ordinaire - Clôture exercice', '1. Bilan des activités de l\\'année\\n2. Préparation du compte administratif\\n3. Plan d\\'action pour l\\'année suivante', 'Passé', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                    ('2024-09-15', 'Séance Extraordinaire - Rentrée Scolaire', '1. Dispositions pour l\\'ouverture des classes\\n2. Travaux de réhabilitation des écoles\\n3. Dotations en fournitures scolaires', 'Passé', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                    ('2024-06-10', 'Séance Ordinaire - Compte administratif 2022', '1. Présentation du compte administratif\\n2. Quitus au Receveur Municipal\\n3. Affectation des résultats', 'Passé', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
                    ('2024-03-05', 'Séance Ordinaire - Débat d\\'orientations budgétaires', '1. Orientations financières pluriannuelles\\n2. Stratégie d\\'investissement\\n3. Évolution de la masse salariale', 'Passé', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
                `);
            } else {
                // Update dates for existing sessions to be more current if they are very old
                await connection.query("UPDATE council_sessions SET date = '2026-06-20' WHERE status = 'A venir'");
                // Ensure agenda is populated for existing sessions if it's null
                await connection.query("UPDATE council_sessions SET agenda = '1. Approbation du procès-verbal précédent\\n2. Débat d\\'Orientation Budgétaire\\n3. Vote des taxes\\n4. Questions diverses' WHERE agenda IS NULL OR agenda = ''");
            }
            
            // Seed Projects if empty
            const [projRows] = await connection.query('SELECT COUNT(*) as count FROM projects');
            if (projRows[0].count === 0) {
                console.log('🌱 Seeding projects data...');
                await connection.query(`
                    INSERT INTO projects (category, title, description, budget, location_name, status, progress_pct, image_url, latitude, longitude, partners) VALUES
                    ('Construction de routes', 'Rénovation Avenue Blaise Diagne', 'Réhabilitation complète de la chaussée et création de trottoirs drainants.', '150 000 000 FCFA', 'Avenue Blaise Diagne, Centre-ville', 'en_cours', 65, 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80', 12.5833, -16.2719, 'AGEROUTE, Banque Mondiale'),
                    ('Éclairage public', 'Extension réseau solaire Boucotte', 'Installation de 200 lampadaires solaires intelligents pour sécuriser les axes nocturnes.', '45 000 000 FCFA', 'Quartier Boucotte', 'en_cours', 30, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80', 12.5750, -16.2650, 'Senelec, ONG GreenCity'),
                    ('Réhabilitation écoles', 'Groupe Scolaire Lyndiane II', 'Réfection des toitures, peinture et équipement en matériel informatique.', '25 000 000 FCFA', 'Lyndiane', 'realise', 100, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80', 12.5900, -16.2800, 'Minsitère de l\\'Éducation, Unicef'),
                    ('Numérisation état civil', 'Ziguinchor Smart City', 'Archivage numérique de 50 ans d\\'actes civils et mise en ligne du portail.', '80 000 000 FCFA', 'Hôtel de Ville', 'realise', 100, 'https://images.unsplash.com/photo-1510511459019-5dee995ad3ff?auto=format&fit=crop&q=80', 12.5847, -16.2730, 'ADIE, Coopération Française'),
                    ('Infrastructures Sportives', 'Complexe Sportif de Néma', 'Construction d\\'un terrain multisports et vestiaires modernes.', '120 000 000 FCFA', 'Néma', 'avenir', 0, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80', 12.5600, -16.2500, 'Gouvernement du Sénégal')
                `);
            }

            // Create About Sections Table
            await ensureTable('about_sections', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Seed About Sections if empty
            const [aboutRowsCheck] = await connection.query('SELECT COUNT(*) as count FROM about_sections');
            if (aboutRowsCheck[0].count === 0) {
                console.log('🌱 Seeding about sections data...');
                await connection.query(`
                    INSERT INTO about_sections (title, content) VALUES
                    ('Ziguinchor la Belle', 'Fière héritière d\\'une histoire riche, Ziguinchor s\\'affirme aujourd\\'hui comme le carrefour économique et culturel de la Casamance. Notre ville cultive un art de vivre unique entre fleuve et mangrove.'),
                    ('Notre Vision', 'Nous œuvrons pour une ville inclusive, durable et innovante. La modernisation des services publics et la participation citoyenne sont au cœur de notre engagement pour le bien-être de tous.')
                `);
            }

            // Create About Stats Table
            await ensureTable('about_stats', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                value VARCHAR(100) NOT NULL,
                icon VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Seed About Stats if empty
            const [statsRowsCheck] = await connection.query('SELECT COUNT(*) as count FROM about_stats');
            if (statsRowsCheck[0].count === 0) {
                console.log('🌱 Seeding about stats data...');
                await connection.query(`
                    INSERT INTO about_stats (label, value, icon) VALUES
                    ('Population de la ville', '300 000+', 'Users'),
                    ('Découpage Administratif', '31 Quartiers', 'Map'),
                    ('Budget de Fonctionnement', '4.2 Milliards', 'TrendingUp')
                `);
            }

            // Create Neighborhoods Table
            await ensureTable('neighborhoods', `(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                representative VARCHAR(255),
                nextMeeting VARCHAR(100),
                location VARCHAR(255),
                description TEXT,
                image VARCHAR(255),
                reports_url VARCHAR(255),
                contact_email VARCHAR(100),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Seed Neighborhoods if empty
            const [nhRowsCheck] = await connection.query('SELECT COUNT(*) as count FROM neighborhoods');
            if (nhRowsCheck[0].count === 0) {
                console.log('🌱 Seeding neighborhoods data...');
                await connection.query(`
                    INSERT INTO neighborhoods (name, representative, nextMeeting, location, description, image, reports_url, contact_email, latitude, longitude) VALUES
                    ('Escale', 'Mme. Aminata Diallo', '2024-05-15 10:00:00', 'Centre Culturel Régional', 'Le cœur historique et administratif de la ville, abritant les principaux commerces, l\\'hôtel de ville et le port. Un quartier mixte alliant habitat colonial et activités économiques.', 'https://images.unsplash.com/photo-1518005020455-2ec503027679?auto=format&fit=crop&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'escale@mairie-zig.sn', 12.5870, -16.2740),
                    ('Boucott', 'M. Oumar Ndiaye', '2024-05-18 16:00:00', 'École Boucott Sud', 'Quartier populaire et dynamique, connu pour son grand marché, ses artisans et sa vie associative très dense. C\\'est l\\'un des quartiers les plus peuplés de Ziguinchor.', 'https://images.unsplash.com/photo-1449156001934-02717e35b753?auto=format&fit=crop&q=80', null, 'boucott@mairie-zig.sn', 12.5800, -16.2650),
                    ('Lindiane', 'M. Pierre Gomis', '2024-05-20 17:00:00', 'Foyer des Jeunes', 'Zone résidentielle en pleine expansion à l\\'ouest de la ville. Les priorités actuelles concernent l\\'extension du réseau électrique et l\\'aménagement de la voirie secondaire.', null, null, 'lindiane@mairie-zig.sn', 12.5750, -16.2950),
                    ('Kandé', 'Mme. Sophie Badji', '2024-05-22 15:30:00', 'Place Publique', 'Quartier traditionnel situé à proximité du fleuve. Les activités de pêche et de transformation des produits halieutiques y sont prédominantes.', null, null, 'kande@mairie-zig.sn', 12.5900, -16.2850),
                    ('Néma', 'M. Jean Mendy', '2024-05-25 09:00:00', 'Centre Social', 'Quartier calme abritant de nombreuses infrastructures scolaires et universitaires. Le conseil de quartier travaille activement sur la salubrité et les espaces verts.', null, null, 'nema@mairie-zig.sn', 12.5700, -16.2700),
                    ('Tilène', 'M. Abdoulaye Cissé', '2024-05-28 18:00:00', 'Maison de Quartier', 'Quartier charnière entre le centre et la périphérie, Tilène est un carrefour commercial important avec une forte jeunesse engagée dans le sport.', null, null, 'tilene@mairie-zig.sn', 12.5950, -16.2600)
                `);
            }
            
            // INDIVIDUAL COLUMN CHECKS for safety
            await addColumn('neighborhoods', 'latitude', 'DECIMAL(10,8)');
            await addColumn('neighborhoods', 'longitude', 'DECIMAL(11,8)');

            console.log('✅ Migration des tables et colonnes terminée');
        } catch (migErr) {
            console.warn('⚠️ Migration:', migErr.message);
        }
        
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur critique de connexion à la base de données:');
        console.error(err.message);
        console.error('Assurez-vous que le serveur MySQL est démarré et que le fichier database.sql a été importé.');
    });

module.exports = pool;
