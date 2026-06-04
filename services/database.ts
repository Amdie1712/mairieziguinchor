// Fix Dossier import source: Dossier is exported from ./api, not ./auth.
import { Article, Event, CouncilMember, CouncilSession, Report, Dossier } from './api';
import { User } from './auth';

// --- Types pour la DB ---
export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Nouveau' | 'Lu' | 'Traité';
}

interface DatabaseSchema {
  users: User[];
  articles: Article[];
  events: Event[];
  members: CouncilMember[];
  sessions: CouncilSession[];
  reports: Report[];
  messages: Message[];
  dossiers: Record<string, Dossier[]>; // userId -> Dossiers[]
}

const DB_KEY = 'mairie_ziguinchor_full_db_v1';

// --- Données Initiales (Seed) ---
const INITIAL_DATA: DatabaseSchema = {
  users: [
    { id: 'admin-1', name: 'Administrateur', email: 'admin@mairie.sn', password: 'admin', role: 'admin' },
    { id: 'admin-test', name: 'Test Admin', email: 'testadmin@mairie.sn', password: 'password123', role: 'admin' },
    { id: 'user-1', name: 'Moussa Diop', email: 'demo@ziguinchor.sn', password: 'demo' }
  ],
  articles: [
    {
        id: 1,
        title: "Conseil Municipal : Vote du budget 2024",
        category: "Politique",
        content: "Le conseil municipal s'est réuni ce mardi pour débattre des orientations budgétaires de l'année à venir, avec un accent mis sur l'éducation et la voirie. Le Maire a souligné l'importance de la transparence dans la gestion des fonds publics.",
        imageUrl: "https://picsum.photos/id/1018/800/600",
        date: "2023-11-01",
        isFeatured: true
      },
      {
        id: 2,
        title: "Inauguration du nouveau marché central",
        category: "Développement",
        content: "Le Maire a procédé ce matin à l'inauguration des nouvelles infrastructures du marché, offrant un cadre plus salubre aux commerçants et aux clients. Ce projet vise à dynamiser l'économie locale.",
        imageUrl: "https://picsum.photos/400/250?random=1",
        date: "2023-10-12",
        isFeatured: false
      },
      {
        id: 3,
        title: "Rénovation des écoles du quartier Escale",
        category: "Urbanisme",
        content: "Les travaux de réhabilitation ont débuté pour offrir de meilleures conditions aux élèves. Les nouvelles salles de classe seront équipées de matériel moderne pour faciliter l'apprentissage.",
        imageUrl: "https://picsum.photos/id/202/150/150",
        date: "2023-10-15",
        isFeatured: false
      },
      {
        id: 4,
        title: "Campagne de vaccination gratuite",
        category: "Santé",
        content: "Une grande campagne de vaccination contre la grippe est organisée dans tous les districts sanitaires de la ville. Les populations vulnérables sont invitées à se rapprocher des centres de santé.",
        imageUrl: "https://picsum.photos/id/203/150/150",
        date: "2023-10-18",
        isFeatured: false
      }
  ],
  events: [
    {
        id: 1,
        title: "Festival Culturel de Casamance",
        category: "Culture",
        description: "Trois jours de célébration de la culture casamançaise avec concerts, danses traditionnelles et foire artisanale.",
        imageUrl: "https://picsum.photos/id/10/800/600",
        date: "2023-12-15",
        time: "10:00 - 23:00",
        location: "Place de Gao"
      },
      {
        id: 2,
        title: "Conseil Municipal Public",
        category: "Politique",
        description: "Séance ordinaire du conseil municipal ouverte au public. Ordre du jour : Budget 2024.",
        imageUrl: "https://picsum.photos/id/11/800/600",
        date: "2023-12-20",
        time: "09:00 - 12:00",
        location: "Salle des délibérations, Mairie"
      },
      {
        id: 3,
        title: "Tournoi de Football Inter-quartiers",
        category: "Sport",
        description: "Finale du grand tournoi de football réunissant les équipes des différents quartiers de la ville.",
        imageUrl: "https://picsum.photos/id/12/800/600",
        date: "2023-12-25",
        time: "15:00 - 18:00",
        location: "Stade Aline Sitoé Diatta"
      }
  ],
  members: [
    { id: 1, name: "Ousmane Sonko", role: "Maire de Ziguinchor", image: "https://picsum.photos/id/64/300/300" },
    { id: 2, name: "Aïda BODIAN", role: "1ère Adjointe", image: "https://picsum.photos/id/65/300/300", commission: "Chargé des questions pédagogiques et sociales dans l'éducation élémentaire" },
    { id: 3, name: "Ndiaga DIEYE", role: "2ème Adjoint", image: "https://picsum.photos/id/66/300/300", commission: "Chargé des finances et de la coopération" },
    { id: 4, name: "Oulimata SIDIBE", role: "3ème Adjointe", image: "https://picsum.photos/id/67/300/300", commission: "Chargé des questions pédagogiques et sociales dans l'éducation préscolaire" },
    { id: 5, name: "Alassane DIEDHIOU", role: "4ème Adjoint", image: "https://picsum.photos/id/68/300/300", commission: "Chargé de la santé et de la citoyenneté" },
    { id: 6, name: "Aminata Touré", role: "5ème Adjointe", image: "https://picsum.photos/id/72/300/300", commission: "Économie locale" },
    { id: 7, name: "Babacar Faye", role: "6ème Adjoint", image: "https://picsum.photos/id/73/300/300", commission: "Environnement et cadre de vie" },
    { id: 8, name: "Khadidiatou Fall", role: "7ème Adjointe", image: "https://picsum.photos/id/74/300/300", commission: "Culture et patrimoine" },
    { id: 9, name: "Oumar Sagna", role: "8ème Adjoint", image: "https://picsum.photos/id/75/300/300", commission: "Éducation et formation" },
    { id: 10, name: "Seynabou Diouf", role: "9ème Adjointe", image: "https://picsum.photos/id/76/300/300", commission: "Tourisme et artisanat" },
    { id: 11, name: "Abdou Sané", role: "10ème Adjoint", image: "https://picsum.photos/id/77/300/300", commission: "Sécurité et protection civile" },
    { id: 12, name: "Marianne Bodian", role: "11ème Adjointe", image: "https://picsum.photos/id/78/300/300", commission: "Marchés Publics" },
    { id: 13, name: "Cheikh Tidiane Diédhiou", role: "12ème Adjoint", image: "https://picsum.photos/id/79/300/300", commission: "Coopération décentralisée" },
    { id: 14, name: "Ndèye Marie Sy", role: "13ème Adjointe", image: "https://picsum.photos/id/80/300/300", commission: "Genre et équité" },
    { id: 15, name: "Lamine Diedhiou", role: "14ème Adjoint", image: "https://picsum.photos/id/81/300/300", commission: "Sports et loisirs" },
    { id: 16, name: "Isatou Badji", role: "15ème Adjointe", image: "https://picsum.photos/id/82/300/300", commission: "Hygiène et salubrité" },
    { id: 17, name: "Modou Fall", role: "16ème Adjoint", image: "https://picsum.photos/id/83/300/300", commission: "Commerce et foires" },
    { id: 18, name: "Mariama Sarr", role: "Conseillère", image: "https://picsum.photos/id/69/300/300", commission: "Commission Sociale" },
    { id: 19, name: "Abdoulaye Diallo", role: "Conseiller", image: "https://picsum.photos/id/70/300/300", commission: "Commission Culturelle" },
    { id: 20, name: "Sophie Badji", role: "Conseillère", image: "https://picsum.photos/id/71/300/300", commission: "Commission Environnement" },
  ],
  sessions: [
    { id: 101, date: "2023-12-20", title: "Séance Ordinaire - Vote du Budget 2024", status: "A venir" },
    { id: 100, date: "2023-09-15", title: "Séance Extraordinaire - Rentrée Scolaire", status: "Passé", docUrl: "#" },
    { id: 99, date: "2023-06-10", title: "Séance Ordinaire - Compte administratif 2022", status: "Passé", docUrl: "#" },
    { id: 98, date: "2023-03-05", title: "Séance Ordinaire - Débat d'orientations budgétaires", status: "Passé", docUrl: "#" }
  ],
  reports: [],
  messages: [],
  dossiers: {
      'user-1': [
        { id: 'DOS-2023-001', type: 'Acte de naissance', category: 'État Civil', status: 'VALIDE', date: '2023-10-01', description: 'Demande de copie intégrale', form_data: {} },
        { id: 'DOS-2023-004', type: 'Permis de construire', category: 'Urbanisme', status: 'EN_ANALYSE', date: '2023-11-12', description: 'Extension maison individuelle', form_data: {} },
      ]
  }
};

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load DB", e);
    }
    this.save(INITIAL_DATA); // Persist initial data
    return INITIAL_DATA;
  }

  private save(data: DatabaseSchema = this.data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    this.data = data;
  }

  // --- Generic Helpers ---
  async delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- Public API ---
  
  // Articles
  getArticles() { return this.data.articles; }
  addArticle(article: Article) {
    this.data.articles.unshift(article);
    this.save();
  }

  // Events
  getEvents() { return this.data.events; }
  
  // Council
  getMembers() { return this.data.members; }
  getSessions() { return this.data.sessions; }

  // Reports (Signalements)
  getReports() { return this.data.reports; }
  addReport(report: Report) {
    this.data.reports.unshift(report);
    this.save();
    return report;
  }
  updateReportStatus(id: number, status: Report['status']) {
    const report = this.data.reports.find(r => r.id === id);
    if (report) {
        report.status = status;
        this.save();
    }
  }

  // Messages (Contact)
  getMessages() { return this.data.messages; }
  addMessage(msg: Message) {
    this.data.messages.unshift(msg);
    this.save();
    return msg;
  }

  // Users & Auth
  getUsers() { return this.data.users; }
  addUser(user: User) {
    this.data.users.push(user);
    this.save();
  }
  findUserByEmail(email: string) {
    return this.data.users.find(u => u.email === email);
  }

  // Dossiers
  getUserDossiers(userId: string) {
    return this.data.dossiers[userId] || [];
  }
  getAllDossiers() {
    // Flatten dossiers for admin
    return Object.entries(this.data.dossiers).flatMap(([userId, dossiers]) => 
        dossiers.map(d => ({...d, userId}))
    );
  }
  addDossier(userId: string, dossier: Dossier) {
    if (!this.data.dossiers[userId]) {
        this.data.dossiers[userId] = [];
    }
    this.data.dossiers[userId].unshift(dossier);
    this.save();
    return dossier;
  }
  
  // Reset for Debug
  reset() {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
  }
}

export const db = new DatabaseService();