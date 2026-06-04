-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 04 juin 2026 à 11:51
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mairie_ziguinchor`
--

-- --------------------------------------------------------

--
-- Structure de la table `about_sections`
--

DROP TABLE IF EXISTS `about_sections`;
CREATE TABLE IF NOT EXISTS `about_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `about_sections`
--

INSERT INTO `about_sections` (`id`, `title`, `content`, `created_at`, `updated_at`) VALUES
(1, 'Notre Mission', 'Servir les citoyens de Ziguinchor avec transparence et efficacité.', '2025-12-17 11:41:25', '2026-05-18 11:31:47'),
(2, 'Nos Valeurs', 'Intégrité, Proximité, Innovation, Développement durable.', '2025-12-17 11:41:25', '2025-12-17 11:41:25'),
(3, 'Notre Histoire', 'Fondée en 1886, Ziguinchor est une ville historique de la Casamance.', '2025-12-17 11:41:25', '2025-12-17 11:41:25');

-- --------------------------------------------------------

--
-- Structure de la table `about_stats`
--

DROP TABLE IF EXISTS `about_stats`;
CREATE TABLE IF NOT EXISTS `about_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `about_stats`
--

INSERT INTO `about_stats` (`id`, `label`, `value`, `icon`, `created_at`) VALUES
(1, 'Population', '300 000 habitants', 'Users', '2026-05-18 11:38:37'),
(2, 'Quartiers', '35', 'MapPin', '2026-05-18 11:38:37'),
(3, 'Agents municipaux', '150', 'Building2', '2026-05-18 11:38:37'),
(4, 'Services publics', '18', 'Briefcase', '2026-05-18 11:38:37');

-- --------------------------------------------------------

--
-- Structure de la table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `articles`
--

INSERT INTO `articles` (`id`, `title`, `category`, `content`, `imageUrl`, `date`, `isFeatured`, `created_at`, `updated_at`) VALUES
(1, 'La convention entre la mairie de Ziguinchor et la SONAGED SA porte ses fruits', 'Actualité', 'La convention signée le 22 avril 2025 entre la mairie de Ziguinchor et la SONAGED SA porte ses fruits. \r\nEn effet, la société nationale de gestion des déchets est en pleine activité de curage des caniveaux. \r\nSoucieux de l\'importance de cette activité, le Maire Djibril SONKO a effectué une visite de terrain le mercredi 4 juin 2025. Sur les lieux, il a été constaté que depuis le démarrage, neuf et demi de kilomètres sont déjà curés. Satisfait de la qualité des travaux et de la perfection des équipes de la SONAGED SA, le premier Magistrat de Ziguinchor a exprimé toute sa reconnaissance à son partenaire stratégique. \r\nSaisissant cette opportunité, l\'édile de la commune a appelé les Ziguinchorois au civisme en arrêtant de jeter les ordures dans les caniveaux pour le bien être de tous. \r\nLa commune de Ziguinchor, toujours au service de sa population \r\n#burok en marche', 'http://localhost:3000/uploads/1776941757075.jpg', '2023-11-01', 1, '2025-12-17 09:43:22', '2026-04-23 10:55:57'),
(2, '13 octobre 2025 — Une date historique pour Ziguinchor !', 'Développement', 'La journée du 13 octobre 2025 restera à jamais gravée dans la mémoire des Ziguinchorois avec l’inauguration du marché moderne de Tilène par le Ministre de l’Industrie et du Commerce.\r\nDans son allocution, le Maire Djibril SONKO a souligné que cette nouvelle infrastructure constitue un espace marchand moderne, répondant à toutes les normes de sécurité et offrant les commodités nécessaires pour le bien-être des commerçants et des usagers.\r\nLe Maire a également sollicité du Ministre la restitution intégrale du marché de Tilène à la Commune de Ziguinchor, conformément à l’article 81 du Code général des collectivités territoriales.\r\nIl a enfin invité les acteurs économiques, les populations et tous les usagers à préserver ce « Paradis commercial », symbole du dynamisme et du développement de notre belle cité.\r\n✨ Le Burok City en marche vers la modernité !', 'http://localhost:3000/uploads/1776946120884.jpg', '2023-10-12', 1, '2025-12-17 09:43:22', '2026-04-23 12:08:40'),
(3, 'Installation du nouveau Commandant de la Zone Militaire n°5 ', 'Actualité', 'Ce vendredi 10 octobre 2025, la Commune, représentée par l’Adjoint au Maire, El Hadji Saër FAYE, a honoré l’invitation des Autorités militaires à la cérémonie d’installation du nouveau Commandant de la Zone Militaire n°5 (COMZONE 5).\r\nCette cérémonie solennelle, présidée par le Général de Corps d’Armée Mbaye Cissé, Chef d’État-Major Général des Armées, s’est tenue au Poste de Commandement de la Zone Militaire, en présence des Autorités militaires, administratives, déconcentrées et décentralisées.\r\nLa Commune a saisi cette occasion pour féliciter le Colonel Cheikh Guèye, nouveau COMZONE 5, lui adresser ses prières de réussite dans l’accomplissement de ses missions et réaffirmer sa volonté de collaborer étroitement avec les Forces armées pour le développement et la stabilité de notre région.', 'http://localhost:3000/uploads/1776945823826.jpg', '2023-10-15', 1, '2025-12-17 09:43:22', '2026-04-23 12:03:43'),
(4, ' Journée du Volontariat Français à Ziguinchor', 'Actualité', 'Le Jeudi 2 Octobre 2024 a été célébrée comme la « Journée du Volontariat Français ». La Commune de Ziguinchor a eu l’honneur d’abriter cette édition, désignée comme la commune de convergence de l’ensemble des volontaires français œuvrant aux quatre coins du Sénégal.\r\nCette journée a été marquée par une forte représentation des diplomates français, témoignant du succès de cette initiative.\r\nLe Maire de Ziguinchor, Monsieur Djibril SONKO, était représenté par Monsieur Abdou SANÉ, Conseiller chargé de l\'urbanisme et de l\'environnement. Sa présence a souligné l\'importance de la thématique principale de cette édition : la gestion durable des déchets.\r\nAprès la première convention de volontariat en Casamance signée à Ziguinchor en 1972, on constate une continuité remarquable de l’engagement des volontaires dans l’appui aux communautés, le renforcement du vivre-ensemble et de la solidarité internationale entre le Sénégal et la France.\r\nUn bel exemple de coopération et d’amitié franco-sénégalaise pour des enjeux essentiels !\r\n', 'http://localhost:3000/uploads/1776945685782.jpg', '2023-10-18', 1, '2025-12-17 09:43:22', '2026-04-23 12:01:25'),
(5, 'Hommage à Monsieur Ibrahima Cissé de ISCOS NATIONAL (Italie).', 'Actualité', 'Hommage à Monsieur Ibrahima Cissé de ISCOS NATIONAL (Italie).\r\nPar Monsieur Djibril SONKO Maire de Ziguinchor\r\nC’est avec une profonde tristesse, que nous avons appris, le 25 Octobre 2025, le rappel à Dieu de Monsieur Ibrahima Cissé, représentant de notre partenaire italien de coopération internationale, ISCOS NATIONAL. \r\nIbrahima Cissé n’était pas seulement un partenaire de développement, il était un homme de convictions, un bâtisseur de ponts entre les peuples et les cultures, un artisan de solidarité humaine entre le Sénégal et l’Italie, n’intervenant pas qu’à Ziguinchor. Ibrahima était aussi un ami très fidèle, sensible aux besoins multisectoriels de développement de la Commune de Ziguinchor.\r\nGrâce à son engagement constant et à sa volonté inébranlable de servir les autres, malgré sa maladie à conséquence fatale apparemment irréversible, notre Commune a pu bénéficier, sous la supervision de la représentante pays, Wanda DIMITRI, que nous saluons vivement, de plusieurs projets porteurs d’espoir au cours de ces dernières années.\r\nSous la coordination locale bienveillante et visionnaire, de nombreux programmes ont vu le jour et impacté durablement la vie de nos populations dans divers domaines tels que :\r\n• La Santé et le Bien-être communautaire ;\r\n• L’Éducation et la Formation des jeunes ;\r\n• Les Sports et Loisirs ;\r\n• Le Développement d’infrastructures commerciales ;\r\n• Les Programmes d’inclusion sociale et économique pour les jeunes et les femmes ;\r\n• La Protection et gestion durable de l’Environnement et des Ressources naturelles ;\r\n• L’Accompagnement des initiatives citoyennes.\r\nSon sens du partage, sa disponibilité, son amour pour son Pays et particulièrement pour la Commune de Ziguinchor, resteront gravés dans nos mémoires. \r\nIbrahima laisse derrière lui, l’héritage d’un partenariat sincère et exemplaire, fondé sur la confiance, la transparence et la fraternité.\r\nAu nom du Conseil Municipal que j’ai l’honneur de présider, de l’ensemble des populations de Ziguinchor et en mon nom propre, je rends un vibrant hommage à un homme d’honneur, un ami fidèle et attentionné et un partenaire engagé. \r\nNous prions pour le repos de son âme et adressons nos condoléances les plus émues à sa famille, à ISCOS NATIONAL, ISCOS LAZIO, à l’AICS, à ses proches, ainsi qu’à l’ensemble de l’équipe locale de coopération qu’il dirigeait avec tant de dévouement.\r\nQue Dieu l’accueille dans son infinie miséricorde, son œuvre demeurera éternel parmi nous, et son souvenir continuera de nous inspirer. Paix à son âme !', 'http://localhost:3000/uploads/1776946222303.jpg', '2026-04-23', 1, '2026-04-23 12:10:22', '2026-04-23 12:10:22'),
(6, 'Ziguinchor rend hommage aux soldats tombés pour la Nation ', 'Actualité', 'À l’instar des autres cités du pays, Ziguinchor a célébré ce matin la Toussaint, une fête catholique dédiée à tous les Saints, connus et inconnus.\r\nLa cérémonie officielle, présidée par le Gouverneur de Région Mor Talla Tine, a été marquée par un dépôt de gerbe au Monument aux Morts, en présence des autorités militaires et territoriales.\r\nLe Maire de Ziguinchor, M. Djibril SONKO, y était représenté par son adjoint M. Saer FAYE, chargé des Ressources humaines et de la Citoyenneté.\r\nLa délégation conduite par le Gouverneur s’est ensuite rendue dans les cimetières de Santhiaba, Belfort et Kanténe, pour se recueillir sur les tombes des soldats tombés sur les champs d’opérations, dans la défense et la préservation de l’intégrité du territoire national.\r\nDans son allocution, le Gouverneur a exhorté les services publics et territoriaux à redoubler d’efforts pour soulager les maux des populations, tout en saluant l’engagement de la Mairie et des autorités militaires pour la réussite de cette cérémonie empreinte de solennité et de reconnaissance.\r\n🕊️ Honneur et respect à nos héros tombés pour la Patrie. 🇸🇳', 'http://localhost:3000/uploads/1776946341099.jpg', '2026-04-23', 1, '2026-04-23 12:12:21', '2026-04-23 12:12:21'),
(7, 'Session ordinaire du Conseil Municipal de Ziguinchor', 'Actualité', 'Mercredi 03 décembre 2025 : Session ordinaire du Conseil Municipal de Ziguinchor. \r\nLe Conseil municipal de Ziguinchor, sous la présidence du Maire Djibril SONKO, s’est réuni ce mercredi 03 décembre 2025 à la Salle de délibération pour la dernière Session ordinaire de l’année 2025. Dès l’entame de cette Session, le Conseil a adopté à l’unanimité le Budget 2026, arrêté à 7 385 240 984 de francs CFA, répartis entre la Section Fonctionnement pour 2 681 105 498 de Francs CFA et la Section Investissement pour 4 704 135 486 de Francs CFA.  Le Conseil Municipal a également adopté pour la plupart à l’unanimité, les points suivants :\r\n 1- Projet de virement de crédit ;\r\n 2- Autorisation de virement pour AGETIP ;\r\n 3- Le Plan Climat Territorial de la Commune ;\r\n 4- La Convention de collaboration entre la SOGEPA et la Mairie ; \r\n5- Le classement de la Rue « Santhiaba ES 07 » en rue piétonne ; \r\n6- La dénomination du Boulevard 54m au nom de Robert SAGNA ; \r\n7- Le PTI 2026–2028 ; \r\n8- Le PAI 2026 ; \r\n9- Le PARCA 2026 ;\r\n 10- Les nouvelles taxes relatives à la location du corbillard ;\r\n 11- Diverses taxes relatives aux occupations du nouvel équipement marchand à Tilène ;\r\n 12- L’autorisation de recruter du personnel (permanents, temporaires et prestataires). \r\nDans sa Communication, le Maire a informé le Conseil de l’acquisition en cours d’une pondeuse de pavés, destinée à soutenir la construction et la réhabilitation de routes dans la Commune. Il a également annoncé l’arrivée prochaine du matériel de décoration marquant la célébration des festivités de fin et début d’année. Le Maire et l’ensemble du Conseil Municipal ont réaffirmé leur engagement à faire de Ziguinchor une Commune émergente, attrayante, où il fait bon vivre.', 'http://localhost:3000/uploads/1776946669387.jpg', '2026-04-23', 1, '2026-04-23 12:17:49', '2026-04-23 12:17:49'),
(8, 'L’homme plastique : contre la pollution des déchets plastiques', 'Actualité', 'Ziguinchor : Modou Fall, communément appelé « l’homme plastique », marche les 14 et 15 janvier, contre la pollution des déchets plastiques dans la Région de Ziguinchor.\r\nReçu sur instruction du Maire de Ziguinchor par ses Services avec son ami autrichien Niclas, lui aussi fervent défenseur de l\'environnement, un programme leur est concocté dans la foulée. Ainsi, en compagnie de l\'équipe de Communication, les deux \"hommes plastiques\" ont sillonné certaines grandes artères de la Commune et les zones d\'affluence telles que les équipements marchands, avant de se rendre au groupe scolaire ISM situé à Kénia, à la limite périphérique Sud-Est de Ziguinchor. Cela a permis de sensibiliser les populations et surtout les plus jeunes sur un nécessaire changement de comportements par rapports aux déchets,  au cœur des combats politiques des autorités municipales. A la suite d\'une heure d\'échanges avec les jeunes dans l\'amphithéâtre du groupe scolaire ISM, les deux hommes on regagné l\'Hôtel de Ville de Ziguinchor où un départ vers le Cap Skirring est organisé par les services municipaux et l\'équipe SONAGED de sensibilisation sur la gestion des déchets municipaux.', 'http://localhost:3000/uploads/1776947466661.jpg', '2026-04-23', 1, '2026-04-23 12:31:06', '2026-04-23 12:31:06');

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `target_type`, `target_id`, `details`, `ip_address`, `created_at`) VALUES
(1, NULL, 'UPDATE_SETTINGS', 'SYSTEM', NULL, '{\"footer_text\":\"© 2026 Mairie de Ziguinchor - Tous droits réservés\"}', '127.0.0.1', '2026-05-21 14:51:27'),
(2, NULL, 'UPDATE_SETTINGS', 'SYSTEM', NULL, '{\"maintenance_mode\":\"true\",\"contact_email\":\"contact@mairiedeziguinchor.sn\",\"contact_phone\":\"+221 33 991 20 90\"}', '127.0.0.1', '2026-05-22 09:34:56');

-- --------------------------------------------------------

--
-- Structure de la table `council_members`
--

DROP TABLE IF EXISTS `council_members`;
CREATE TABLE IF NOT EXISTS `council_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `council_members`
--

INSERT INTO `council_members` (`id`, `name`, `role`, `image`, `commission`, `created_at`) VALUES
(1, 'Djibril Sonko', 'Maire de Ziguinchor', '/images/elus/maire.jpg', '', '2025-12-17 09:45:17'),
(2, 'Aïda BODIAN', '1ère Adjointe', 'http://localhost:3000/uploads/members/1776690949836-Adj-1.jpeg', 'Chargé des questions pédagogiques et sociales dans l\'éducation élémentaire', '2025-12-17 09:45:17'),
(3, 'Ndiaga DIEYE', '2ème Adjoint', 'http://localhost:3000/uploads/members/1776690984761-Adj-22.jpg', 'Chargé des finances et de la coopération', '2025-12-17 09:45:17'),
(4, 'Oulimata SIDIBE', '3ème Adjointe', 'http://localhost:3000/uploads/members/1776691067501-Adj3.jpeg', 'Chargé des questions pédagogiques et sociales dans l\'éducation prescolaire', '2025-12-17 09:45:17'),
(5, 'Alassane DIEDHIOU', '4éme Adjoint ', 'http://localhost:3000/uploads/members/1776691233372-adj4.jpeg', 'Chargé de la santé et de la citoyenneté', '2026-02-11 10:51:42'),
(6, 'Fatma Niang ', '5ᵉ adjointe ', 'http://localhost:3000/uploads/members/1776762768734-adj5.jpeg', 'Chargée des relations avec les organisations féminines', '2026-04-21 09:12:48'),
(7, 'Bassirou Coly', '6ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776762828947-Adj6.jpeg', 'Chargé de la jeunesse, vie étudiante, sécurité', '2026-04-21 09:13:48'),
(8, 'Mariama Badji ', '7ᵉ adjointe ', 'http://localhost:3000/uploads/members/1776762913335-adj-7.jpeg', 'Chargée de l\'artisanat', '2026-04-21 09:15:13'),
(9, 'Aliou Sakho ', '8ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776763004711-adj-8.jpeg', 'Chargé des infrastructures sportives, événements sportifs', '2026-04-21 09:16:44'),
(10, 'Diénaba Fofana ', '9ᵉ adjointe', 'http://localhost:3000/uploads/members/1776763069503-adj-10.jpeg', 'Chargée de la propreté, hygiène publique', '2026-04-21 09:17:49'),
(11, 'Abdou Mané', '10ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776763123215-adj-9.jpeg', 'Chargé de l\'urbanisme et habitat', '2026-04-21 09:18:43'),
(12, 'Marie Innocence Diatta ', '11ᵉ adjointe ', 'http://localhost:3000/uploads/members/1776763183391-adji-11.jpeg', 'Chargée des quartiers', '2026-04-21 09:19:43'),
(13, 'Chérif A. Aziz Cissé ', '12ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776763239199-Adj-12.jpeg', 'Chargé des infrastructures scolaires', '2026-04-21 09:20:39'),
(14, 'Catherine Diatta ', '13ᵉ adjointe ', 'http://localhost:3000/uploads/members/1776763306538-Adj-13.jpeg', 'Chargée de la nature et animal en ville', '2026-04-21 09:21:46'),
(15, 'Bacary Konté ', '14ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776763366672-Adj-14.jpeg', 'Chargé de l\'alphabétisation, langues nationales', '2026-04-21 09:22:46'),
(16, 'Khadidiatou Diémé ', '15ᵉ adjointe ', 'http://localhost:3000/uploads/members/1776763408684-Adj-15.jpeg', 'Chargée de la culture et patrimoine', '2026-04-21 09:23:28'),
(17, 'El Hadji Saer Faye ', '16ᵉ adjoint ', 'http://localhost:3000/uploads/members/1776763452942-Adj-16.jpeg', 'Chargé de la planification, ressources humaines', '2026-04-21 09:24:12'),
(18, 'Conseillé 1', 'Conseillé Municipal', 'http://localhost:3000/uploads/members/1778840559791-plainte.jpg', '', '2026-05-15 10:22:39');

-- --------------------------------------------------------

--
-- Structure de la table `council_sessions`
--

DROP TABLE IF EXISTS `council_sessions`;
CREATE TABLE IF NOT EXISTS `council_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `docUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `agenda` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `council_sessions`
--

INSERT INTO `council_sessions` (`id`, `date`, `title`, `status`, `docUrl`, `created_at`, `agenda`) VALUES
(1, '2026-06-20', 'Séance Ordinaire - Vote du Budget 2026', 'A venir', '#', '2025-12-17 09:45:35', '\"Approbation du procès-verbal de la séance précédente\",\r\n                                        \"Débat d\'Orientation Budgétaire (DOB) pour l\'exercice 2024\",\r\n                                        \"Vote des taux des taxes locales\",\r\n                                        \"Présentation du Plan de Modernisation de l\'éclairage public\",\r\n                                        \"Subventions aux associations sportives et culturelles\",\r\n                                        \"Questions diverses\"'),
(2, '2023-09-15', 'Séance Extraordinaire - Rentrée Scolaire', 'Passé', '#', '2025-12-17 09:45:35', '1. Approbation du procès-verbal précédent\n2. Débat d\'Orientation Budgétaire\n3. Vote des taxes\n4. Questions diverses'),
(3, '2023-06-10', 'Séance Ordinaire - Compte administratif 2022', 'Passé', '#', '2025-12-17 09:45:35', '1. Approbation du procès-verbal précédent\n2. Débat d\'Orientation Budgétaire\n3. Vote des taxes\n4. Questions diverses');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `documents`
--

INSERT INTO `documents` (`id`, `name`, `type`, `size`, `category`, `file_url`, `created_at`, `description`, `date`) VALUES
(1, 'Budget 2024', 'PDF', '2.5 MB', 'Budget', '/docs/budget-2024.pdf', '2025-12-17 11:41:25', NULL, NULL),
(3, 'Plan urbanisme', 'PDF', '4.2 MB', 'Urbanisme', '/docs/plan-urbanisme.pdf', '2025-12-17 11:41:25', NULL, NULL),
(4, 'Compte rendu conseil', 'PDF', '1.1 MB', 'Administration', '/docs/cr-conseil.pdf', '2025-12-17 11:41:25', NULL, NULL),
(5, 'Délibération_1_1', 'PDF', '0.25 Mo', 'Délibérations', 'http://localhost:3000/uploads/documents/1776763901227-deliberation-portant-institution-dun-jour-mensuel-du-nettoyage-communal-et-dune-semaine-du-grand-nettoyage-annuel.pdf', '2025-12-17 17:37:04', NULL, '2026-04-21'),
(6, 'test', 'PDF', '0.27 Mo', 'Délibérations', 'http://localhost:3000/uploads/documents/1776779401645-deliberation-portant-institution-et-promotion-de-disciplines-sportives.pdf', '2026-04-20 13:47:38', 'test1', '2026-04-20');

-- --------------------------------------------------------

--
-- Structure de la table `dossiers`
--

DROP TABLE IF EXISTS `dossiers`;
CREATE TABLE IF NOT EXISTS `dossiers` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date` date DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `form_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `internal_notes` text COLLATE utf8mb4_unicode_ci,
  `service_feedback` text COLLATE utf8mb4_unicode_ci,
  `assigned_service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dossiers`
--

INSERT INTO `dossiers` (`id`, `user_id`, `type`, `category`, `description`, `date`, `status`, `form_data`, `created_at`, `internal_notes`, `service_feedback`, `assigned_service`, `user_name`, `user_email`) VALUES
('ZIG-2026-24080', '5', 'Demande d\'Acte de Naissance', NULL, 'Demande d\'Acte de Naissance pour Ame Dié. Catégorie: État Civil', '2026-05-19', 'REJETE', '{\"firstName\":\"Ame\",\"lastName\":\"Dié\",\"email\":\"amdie@mairie-ziguinchor.sn\",\"phone\":\"771251100\",\"address\":\"\",\"reason\":\"avoir mon acte de naissance\",\"specificInfo\":\"\",\"maritalStatus\":\"Célibataire\",\"childrenCount\":\"0\",\"monthlyIncome\":\"\",\"vulnerabilityType\":\"Aucune\",\"neighborhood\":\"\",\"profession\":\"\",\"motivation\":\"\",\"companyName\":\"\",\"networkReason\":\"\",\"eventDate\":\"2026-05-28\",\"eventPlace\":\"Hôpital régional\",\"concernedName\":\"Ame Diédh\",\"occupationType\":\"Boutique\",\"duration\":\"\",\"applicationType\":\"Stage\",\"studyDomain\":\"\",\"experienceLevel\":\"Débutant\",\"availabilityDate\":\"\",\"childFirstName\":\"\",\"childLastName\":\"\",\"childBirthDate\":\"\",\"schoolLevel\":\"Maternelle\",\"schoolName\":\"\"}', '2026-05-19 12:44:44', NULL, NULL, 'État Civil', NULL, NULL),
('ZIG-2026-34456', '24', 'Demande d\'Emploi', NULL, 'Demande d\'Emploi pour citoyen citoyenn. Catégorie: Emploi & RH', '2026-05-19', 'EN_ANALYSE', '{\"firstName\":\"citoyen\",\"lastName\":\"citoyenn\",\"email\":\"citoyen@mairie.sn\",\"phone\":\"770000000\",\"address\":\"\",\"reason\":\"\",\"specificInfo\":\"\",\"maritalStatus\":\"Célibataire\",\"childrenCount\":\"0\",\"monthlyIncome\":\"\",\"vulnerabilityType\":\"Aucune\",\"neighborhood\":\"\",\"profession\":\"\",\"motivation\":\"mes motivations sont énormes\",\"companyName\":\"\",\"networkReason\":\"\",\"eventDate\":\"\",\"eventPlace\":\"\",\"concernedName\":\"\",\"occupationType\":\"Boutique\",\"duration\":\"\",\"applicationType\":\"Emploi\",\"studyDomain\":\"informatique\",\"experienceLevel\":\"Intermédiaire\",\"availabilityDate\":\"2026-05-30\",\"childFirstName\":\"\",\"childLastName\":\"\",\"childBirthDate\":\"\",\"schoolLevel\":\"Maternelle\",\"schoolName\":\"\"}', '2026-05-19 14:59:34', '', 'tester xxxxxx', 'État Civil', NULL, NULL),
('ZIG-2026-35876', '24', 'Aide médicale ponctuelle', NULL, 'Aide médicale ponctuelle pour citoyen citoyenn. Catégorie: Social', '2026-05-19', 'VALIDE', '{\"firstName\":\"citoyen\",\"lastName\":\"citoyenn\",\"email\":\"citoyen@mairie.sn\",\"phone\":\"770000000\",\"address\":\"\",\"reason\":\"j\'ai besoin d\'aide\",\"specificInfo\":\"\",\"maritalStatus\":\"Divorcé(e)\",\"childrenCount\":\"3\",\"monthlyIncome\":\"1000\",\"vulnerabilityType\":\"Sinistre (Incendie/Inondation)\",\"neighborhood\":\"\",\"profession\":\"\",\"motivation\":\"\",\"companyName\":\"\",\"networkReason\":\"\",\"eventDate\":\"\",\"eventPlace\":\"\",\"concernedName\":\"\",\"occupationType\":\"Boutique\",\"duration\":\"\",\"applicationType\":\"Stage\",\"studyDomain\":\"\",\"experienceLevel\":\"Débutant\",\"availabilityDate\":\"\",\"childFirstName\":\"\",\"childLastName\":\"\",\"childBirthDate\":\"\",\"schoolLevel\":\"Maternelle\",\"schoolName\":\"\"}', '2026-05-19 14:57:55', '', 'Passer la mairie', 'Santé & Action Sociale', NULL, NULL),
('ZIG-2026-39132', '5', 'Demande de place ou espace municipal', NULL, 'Demande de place ou espace municipal pour Amadou azerty. Catégorie: Urbanisme', '2026-04-24', 'Validé', '{\"firstName\":\"Amadou\",\"lastName\":\"azerty\",\"email\":\"amdie@mairie-ziguinchor.sn\",\"phone\":\"774561200\",\"address\":\"\",\"reason\":\"test\",\"specificInfo\":\"\",\"maritalStatus\":\"Célibataire\",\"childrenCount\":\"0\",\"monthlyIncome\":\"\",\"vulnerabilityType\":\"Aucune\",\"neighborhood\":\"\",\"profession\":\"\",\"motivation\":\"\",\"companyName\":\"\",\"networkReason\":\"\",\"eventDate\":\"\",\"eventPlace\":\"\",\"concernedName\":\"\",\"occupationType\":\"Boutique\",\"duration\":\"2 jours\",\"applicationType\":\"Stage\",\"studyDomain\":\"\",\"experienceLevel\":\"Débutant\",\"availabilityDate\":\"\",\"childFirstName\":\"\",\"childLastName\":\"\",\"childBirthDate\":\"\",\"schoolLevel\":\"Maternelle\",\"schoolName\":\"\"}', '2026-04-24 15:00:57', '', 'Votre acte est retrouvé. Passer à la mairie pour le récuper', 'Direction des Services Techniques Communaux', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `title`, `category`, `description`, `imageUrl`, `date`, `time`, `location`, `created_at`, `updated_at`) VALUES
(1, 'Festival Culturel de Casamance1', 'Culture', 'Trois jours de célébration de la culture casamançaise...', '/uploads/events/1776948632366-plastique4.jpg', '2025-04-19', '10:00 - 23:00', 'Place de Gao', '2025-12-17 09:44:59', '2026-04-23 12:50:32'),
(2, 'Conseil Municipal Public', 'Politique', 'Séance ordinaire du conseil municipal ouverte au public...', '/uploads/events/1776948066292-47686781.jpg', '2025-04-24', '09:00 - 12:00', 'Salle des délibérations, Mairie', '2025-12-17 09:44:59', '2026-04-23 12:41:06'),
(3, 'Tournoi de Football Inter-quartiers', 'Sport', 'Finale du grand tournoi de football réunissant les équipes...', '/uploads/events/1776948571154-unnamed.jpg', '2025-03-30', '15:00 - 18:00', 'Stade Aline Sitoé Diatta', '2025-12-17 09:44:59', '2026-04-23 12:49:31');

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Accueil','Élus','Patrimoine','Services','Autre') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Autre',
  `date` date DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`id`, `title`, `url`, `category`, `date`) VALUES
(1, 'Le Maire Djibril SONKO', '/images/elus/maire.jpg', 'Accueil', '2026-04-20');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Nouveau',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `neighborhoods`
--

DROP TABLE IF EXISTS `neighborhoods`;
CREATE TABLE IF NOT EXISTS `neighborhoods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `representative` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nextMeeting` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reports_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `neighborhoods`
--

INSERT INTO `neighborhoods` (`id`, `name`, `representative`, `nextMeeting`, `location`, `description`, `created_at`, `image`, `reports_url`, `contact_email`, `latitude`, `longitude`) VALUES
(1, 'Boudody-Escale', 'M. Diallo', '2023-12-20', 'Centre-ville', 'Quartier central ville avec beaucoup de commerces', '2025-12-17 11:41:25', NULL, NULL, NULL, NULL, NULL),
(2, 'Santhiaba', 'Mme Ndiaye', '2026-04-07T08:00', 'Est', 'Quartier résidentiel calme', '2025-12-17 11:41:25', NULL, NULL, NULL, NULL, NULL),
(3, 'Boucotte Sud', 'M. Sarr', '2026-04-08T10:00', 'Ouest', 'Quartier près du fleuve', '2025-12-17 11:41:25', NULL, NULL, NULL, NULL, NULL),
(4, 'Kandé', 'M. Badji', '2023-12-22', 'Nord', 'Quartier en développement', '2025-12-17 11:41:25', NULL, NULL, NULL, NULL, NULL),
(5, 'Diabir', 'Ansou BADIANE', '', 'Est', 'Quartier en extension ', '2026-02-11 11:06:49', NULL, NULL, NULL, NULL, NULL),
(6, 'Boucotte Nord', 'Mr xxxxx', '2026-04-10T08:00', '', 'Quartier prêt du marché Saint maur', '2026-04-23 13:01:47', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `participation_comments`
--

DROP TABLE IF EXISTS `participation_comments`;
CREATE TABLE IF NOT EXISTS `participation_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `participation_comments`
--

INSERT INTO `participation_comments` (`id`, `project_id`, `user_id`, `user_name`, `comment`, `created_at`) VALUES
(1, 2, NULL, 'amdié', 'je valide ce projet qui va permettre à mon quartier de bénéficié d\'une telle infrastructure', '2026-05-22 08:53:29');

-- --------------------------------------------------------

--
-- Structure de la table `participation_projects`
--

DROP TABLE IF EXISTS `participation_projects`;
CREATE TABLE IF NOT EXISTS `participation_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_estimate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Soumis','Validé','Rejeté') COLLATE utf8mb4_unicode_ci DEFAULT 'Soumis',
  `votes_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `participation_projects`
--

INSERT INTO `participation_projects` (`id`, `title`, `description`, `category`, `author_name`, `budget_estimate`, `image_url`, `status`, `votes_count`, `created_at`) VALUES
(2, 'titre projet', 'description détaillée projet', 'Environnement', 'Amdie', '6M FCFA', 'https://picsum.photos/seed/project/800/600', '', 1, '2026-05-18 11:28:39');

-- --------------------------------------------------------

--
-- Structure de la table `procedures_list`
--

DROP TABLE IF EXISTS `procedures_list`;
CREATE TABLE IF NOT EXISTS `procedures_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delay` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isOnline` tinyint(1) DEFAULT '1',
  `dossierType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `required_docs` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=427 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `procedures_list`
--

INSERT INTO `procedures_list` (`id`, `title`, `description`, `icon`, `category`, `delay`, `isOnline`, `dossierType`, `created_at`, `required_docs`) VALUES
(405, 'Demande d\'Acte de Naissance', 'Copie intégrale ou extrait avec ou sans filiation.', 'Baby', 'État Civil', '48h', 1, 'Demande d\'Acte de Naissance', '2026-06-04 09:04:49', 'Pièce d\'identité des parents, Livret de famille'),
(406, 'Demande d\'Acte de Mariage', 'Copie intégrale ou extrait plurilingue.', 'Heart', 'État Civil', '48h', 1, 'Demande d\'Acte de Mariage', '2026-06-04 09:04:49', 'Livret de famille, Pièces d\'identité des époux'),
(407, 'Demande d\'Acte de Décès', 'Copie intégrale d\'acte de décès survenu sur la commune.', 'Skull', 'État Civil', '48h', 1, 'Demande d\'Acte de Décès', '2026-06-04 09:04:49', 'Certificat de décès médical, Pièce d\'identité du déclarant'),
(408, 'Renouvellement CNI', 'Démarche pour le renouvellement de la carte nationale d\'identité.', 'UserCheck', 'Identité', '15 jours', 1, 'Carte d\'identité', '2026-06-04 09:04:49', 'Ancienne CNI, Certificat de résidence, 2 photos d\'identité, Timbre fiscal'),
(409, 'Passeport Biométrique', 'Première demande ou renouvellement de passeport.', 'UserCheck', 'Identité', '10 jours', 1, 'Passeport', '2026-06-04 09:04:49', 'Extrait de naissance de moins de 3 mois, CNI, Certificat de résidence, 4 photos, Timbre fiscal'),
(410, 'Certificat de Résidence', 'Attestation de domicile pour vos démarches administratives.', 'FileText', 'Identité', '48h', 1, 'Résidence', '2026-06-04 09:04:49', 'Facture Senelec/SNDE ou certificat d\'hébergement, Pièce d\'identité'),
(411, 'Inscription Cantine Scolaire', 'Inscription annuelle ou modification du compte cantine.', 'Apple', 'Famille', '48h', 1, 'Cantine scolaire', '2026-06-04 09:04:49', 'Justificatif de domicile, Attestation de paiement des taxes municipales'),
(412, 'Inscription Crèche municipale', 'Dépôt de dossier pour une place en structure multi-accueil.', 'Baby', 'Famille', 'Variable', 1, 'Crèche', '2026-06-04 09:04:49', 'Extrait de naissance de l\'enfant, Carnet de santé, Justificatif de revenus'),
(413, 'Transport Scolaire', 'Demande de carte de transport pour les élèves de la ville.', 'Truck', 'Famille', '7 jours', 1, 'Transport scolaire', '2026-06-04 09:04:49', 'Photo d\'identité, Certificat de scolarité, Justificatif de domicile'),
(414, 'Permis de construire', 'Demande d\'autorisation pour travaux de construction.', 'Home', 'Urbanisme', '2 mois', 1, 'Permis Construire', '2026-06-04 09:04:49', 'Plan de situation, Plan de masse, Titre de propriété, Plans d\'architecte'),
(415, 'Certificat d\'Urbanisme', 'Information sur les droits et règles d\'urbanisme d\'un terrain.', 'Map', 'Urbanisme', '1 mois', 1, 'Urbanisme', '2026-06-04 09:04:49', 'Plan de situation, Extrait de plan cadastral'),
(416, 'Occupation du Domaine Public', 'Terrasses, échafaudages ou déménagement.', 'HardHat', 'Cadre de vie', '15 jours', 1, 'Occupation Domaine', '2026-06-04 09:04:49', 'Plan de l\'occupation, Descriptif des installations, Assurance responsabilité civile'),
(417, 'Signalement Voirie', 'Signalez un nid-de-poule ou un lampadaire en panne.', 'AlertTriangle', 'Cadre de vie', '48h', 1, 'Signalement', '2026-06-04 09:04:49', 'Description précise, Photos du problème (optionnel)'),
(418, 'Carte de Commerçant', 'Identification professionnelle pour les commerçants locaux.', 'Briefcase', 'Professionnels', '7 jours', 1, 'Commerce', '2026-06-04 09:04:49', 'Registre du commerce, NINEA, Pièce d\'identité, Photos'),
(419, 'Rejoindre le réseau Entreprises', 'Inscrivez votre société à l\'annuaire municipal.', 'Building2', 'Professionnels', '48h', 1, 'Rejoindre le réseau Entreprises', '2026-06-04 09:04:49', 'Fiche NINEA, Logo de l\'entreprise, Descriptif des services'),
(420, 'Licence de Débit de Boisson', 'Installation ou transfert d\'une licence 3 ou 4.', 'Coffee', 'Professionnels', '1 mois', 1, 'Licence Boisson', '2026-06-04 09:04:49', 'Casier judiciaire, Bail commercial, Plan des locaux'),
(421, 'Candidature Spontanée (Emploi)', 'Proposez vos compétences à la Ville de Ziguinchor.', 'UserPlus', 'Emploi & RH', '30 jours', 1, 'Demande d\'Emploi', '2026-06-04 09:04:49', 'Curriculum Vitae (CV), Lettre de motivation, Copies des diplômes'),
(422, 'Demande de Stage', 'Effectuez votre stage scolaire ou universitaire en mairie.', 'GraduationCap', 'Emploi & RH', '15 jours', 1, 'Demande de Stage', '2026-06-04 09:04:49', 'Convention de stage, CV, Lettre de motivation'),
(423, 'Devenir Volontaire', 'Participez aux grands événements de la ville comme bénévole.', 'Users', 'Emploi & RH', '7 jours', 1, 'Devenir Volontaire', '2026-06-04 09:04:49', 'Pièce d\'identité, Formulaire de volontariat dûment rempli'),
(424, 'Demande de Subvention', 'Aide financière pour les associations ou familles en difficulté.', 'DollarSign', 'Social', '1 mois', 1, 'Social', '2026-06-04 09:04:49', 'Statuts de l\'association, Récépissé, Rapport d\'activités, Relevé d\'identité bancaire'),
(425, 'Aide Sociale (CCAS)', 'Dépôt de dossier d\'aide alimentaire ou accompagnement.', 'HeartHandshake', 'Social', '15 jours', 1, 'Aide Sociale', '2026-06-04 09:04:49', 'Certificat d\'indigence, Pièce d\'identité, Justificatif de domicile'),
(426, 'Logement Social', 'Constitution du dossier de demande de logement.', 'Building', 'Social', 'Variable', 1, 'Logement Social', '2026-06-04 09:04:49', 'Livret de famille, Justificatifs de revenus (3 derniers mois), Pièce d\'identité');

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress_pct` int DEFAULT '0',
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `completion_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partners` text COLLATE utf8mb4_unicode_ci,
  `results` text COLLATE utf8mb4_unicode_ci,
  `photo_before` text COLLATE utf8mb4_unicode_ci,
  `photo_after` text COLLATE utf8mb4_unicode_ci,
  `studies_in_progress` text COLLATE utf8mb4_unicode_ci,
  `future_investments` text COLLATE utf8mb4_unicode_ci,
  `planned_calendar` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `video_url` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `title`, `status`, `color`, `description`, `image`, `created_at`, `category`, `budget`, `location_name`, `progress_pct`, `image_url`, `completion_date`, `partners`, `results`, `photo_before`, `photo_after`, `studies_in_progress`, `future_investments`, `planned_calendar`, `latitude`, `longitude`, `video_url`) VALUES
(1, 'Nouveau marché central', 'En cours', 'green', 'Construction d\'un nouveau marché moderne', 'https://picsum.photos/id/30/800/600', '2025-12-17 11:41:25', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Rénovation écoles', 'Terminé', 'blue', 'Rénovation de 5 écoles primaires', 'https://picsum.photos/id/20/800/600', '2025-12-17 11:41:25', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Parc urbain', 'À venir', 'yellow', 'Création d\'un parc de 5 hectares', 'https://picsum.photos/id/28/800/600', '2025-12-17 11:41:25', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Route nationale1', 'En cours', 'red', 'Réfection de la RN4', 'https://picsum.photos/id/35/800/600', '2025-12-17 11:41:25', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Nouveau',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_service` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reports`
--

INSERT INTO `reports` (`id`, `type`, `location`, `description`, `email`, `phone`, `date`, `status`, `created_at`, `assigned_service`) VALUES
(1, 'Voirie', 'Lat: 12.5862, Long: -16.2710', 'Problème de voirie', 'amdie@ziguinchor.sn', '776211324', '2025-12-17 17:45:25', 'Pris en compte', '2025-12-17 17:45:24', NULL),
(2, 'Voirie', 'Lat: 12.5864, Long: -16.2708', 'Detail signalement', 'adm@ziguinchor.sn', '774521320', '2025-12-18 15:07:44', 'Résolu', '2025-12-18 15:07:44', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_group` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_group`, `updated_at`) VALUES
(1, 'contact_address', 'Rue du Général de Gaulle, Ziguinchor, Sénégal', 'contact', '2026-05-21 14:49:28'),
(2, 'contact_phone', '+221 33 991 20 90', 'contact', '2026-05-22 09:34:56'),
(3, 'contact_email', 'contact@mairiedeziguinchor.sn', 'contact', '2026-05-22 09:34:56'),
(4, 'maintenance_mode', 'true', 'general', '2026-05-22 09:34:56'),
(5, 'enable_chat', 'true', 'general', '2026-05-21 14:49:28'),
(6, 'footer_text', '© 2026 Mairie de Ziguinchor - Tous droits réservés', 'general', '2026-05-21 14:51:27'),
(7, 'map_lat', '12.5859', 'location', '2026-05-21 14:49:28'),
(8, 'map_lng', '-16.2729', 'location', '2026-05-21 14:49:28');

-- --------------------------------------------------------

--
-- Structure de la table `system_images`
--

DROP TABLE IF EXISTS `system_images`;
CREATE TABLE IF NOT EXISTS `system_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `system_images`
--

INSERT INTO `system_images` (`id`, `key`, `url`, `description`) VALUES
(1, 'home_hero', '/images/accueil/hero.jpg', 'Bannière principale de la page d\'accueil'),
(2, 'mayor_portrait', '/images/elus/maire.jpg', 'Portrait du maire'),
(3, 'services_hero', '/images/services/hero.jpg', 'Bannière des services'),
(4, 'council_hero', '/images/conseil/hero.jpg', 'Bannière du conseil municipal'),
(7, 'logo_portrait', '/images/accueil/logo.jpg', 'logo mairie ziguinchor');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `assignedService` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `assigned_service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `assignedService`, `created_at`, `updated_at`, `assigned_service`, `status`) VALUES
(1, 'Administrateur', 'admin@mairie.sn', '$2a$10$oMAyKl4tshlknsZ9NygKWe9.w6EuaLy7Y0rsYfSa7m86FR/c1BOGy', 'admin', NULL, '2025-12-17 09:44:39', '2026-01-28 14:40:31', ' Administrateur', 'actif'),
(5, 'Amadou  Diedhiou', 'amdie@mairie-ziguinchor.sn', '$2a$10$oMAyKl4tshlknsZ9NygKWe9.w6EuaLy7Y0rsYfSa7m86FR/c1BOGy', 'citoyen', NULL, '2025-12-17 17:21:46', '2026-01-28 13:38:28', NULL, 'actif'),
(10, 'Samba BA', 'basma@mairie.sn', '$2a$10$VNKOMXTK7CJpEP.KlskK1Os8I/N4GqC4xp9rJtMImSWBcLa2GLEbS', 'citoyen', NULL, '2025-12-31 12:43:52', '2025-12-31 12:43:52', NULL, 'actif'),
(12, 'Oumar Ngom', 'oumar@mairie.sn', '$2a$10$ucWoe5B97K8eE/xTI7djLu05xujtClT5VEVnADxAkq3ay71xyidYC', 'citoyen', NULL, '2025-12-31 15:42:42', '2025-12-31 15:42:42', NULL, 'actif'),
(20, 'B.Badji', 'b.badji@mairie-ziguinchor.sn', '$2a$10$oMAyKl4tshlknsZ9NygKWe9.w6EuaLy7Y0rsYfSa7m86FR/c1BOGy', 'employe', NULL, '2026-01-28 10:37:26', '2026-01-28 10:44:15', 'État Civil', 'actif'),
(23, 'Amadou Diedhiou', 'amdie17@mairie-ziguinchor.sn', '$2a$10$r0v.ffT4dQ5WS178PcJ75ud/VonUfP5rBJ3NFMIQHCxHAJr1gD0.u', 'admin', NULL, '2026-03-18 11:47:53', '2026-03-18 11:47:53', NULL, 'actif'),
(24, 'citoyen', 'citoyen@mairie.sn', '$2a$10$7kBlSSQqwQabg7I0OnfKY.LfwJiZ9O/AsUGygqd2pc1KI/seeDP7S', 'citoyen', NULL, '2026-05-19 14:55:55', '2026-05-19 14:55:55', NULL, 'actif');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
