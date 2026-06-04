
import { API_ENDPOINTS } from '../config/apiConfig';

export const API_URL = '/api';

// --- Helper pour inclure le token dans les requêtes ---
const getAuthHeaders = (): Record<string, string> => {
    const stored = localStorage.getItem('mairie_current_user');

    if (stored) {
        const user = JSON.parse(stored);

        if (user.token) {
            return {
                Authorization: `Bearer ${user.token}`
            };
        }
    }

    return {};
};

const secureFetch = async (
    url: string,
    options: RequestInit = {}
) => {

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
        ...getAuthHeaders(),
    };

    // Ajouter Content-Type si ce n'est pas un FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('mairie_current_user');
        window.location.href = '/#/login';
    }

    return response;
};

// --- Interfaces ---
export interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  date: string;
  isFeatured?: boolean;
}

export interface PaginatedArticles {
    data: Article[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface DocumentItem {
    id?: number;
    name: string;
    description?: string;
    date?: string;
    type: string;
    size: string;
    category: string;
    fileUrl?: string;
}

export interface ServiceItem {
  id?: number;
  icon: string;
  title: string;
  description: string;
  action?: string;
  link?: string;
  address?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
}

export interface AboutSection {
  id: number;
  title: string;
  content: string;
}

export interface AboutStat {
  id: number;
  label: string;
  value: string;
  icon?: string;
}

export type MunicipalService = 
    'État Civil' | 
    'Assainissement, Cadre de Vie & Équipements Marchands' | 
    'Voirie & Éclairage Public' | 
    'Éducation, Alphabétisation & Formation' | 
    'Santé & Action Sociale' | 
    'Jeunesse, Sport, Loisirs & Culture' | 
    'Gouvernance & Organisation des Quartiers';

export interface Report {
  id: number;
  type: string;
  location: string;
  description: string;
  email: string;
  phone: string;
  date: string;
  status: 'Nouveau' | 'Pris en compte' | 'Résolu';
  assigned_service?: MunicipalService;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Nouveau' | 'Lu' | 'Traité';
}

export interface CouncilMember {
  id: number;
  name: string;
  role: string;
  image: string;
  commission?: string;
}

export interface CouncilSession {
  id: number;
  date: string;
  title: string;
  agenda?: string;
  status: 'A venir' | 'Passé';
  docUrl?: string;
}

export interface Neighborhood {
  id: number;
  name: string;
  representative: string;
  nextMeeting: string;
  location: string;
  description: string;
  image?: string;
  reports_url?: string;
  contact_email?: string;
  latitude?: number;
  longitude?: number;
}

export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
}

export interface ProcedureItem {
  id?: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  link?: string;
  dossierType?: string;
  delay?: string;
  requiredDocs?: string[];
  isOnline?: boolean;
}

export interface ProjectItem {
  id?: number;
  category: string;
  title: string;
  description: string;
  budget?: string;
  location_name?: string;
  status: 'en_cours' | 'realise' | 'avenir';
  progress_pct: number;
  image_url: string;
   image?: string; // Ajoutez cette ligne si vous utilisez 'image' aussi
    color?: string; // Ajoutez cette ligne
  completion_date?: string;
  partners?: string;
  results?: string;
  photo_before?: string;
  photo_after?: string;
  studies_in_progress?: string;
  future_investments?: string;
  planned_calendar?: string;
  latitude?: number;
  longitude?: number;
  video_url?: string;
  created_at?: string;
}

export interface ProjectStats {
    total_count: number;
    total_budget: number;
    completed_count: number;
    delayed_count: number;
}

export interface ParticipationProject {
  id: number;
  title: string;
  description: string;
  category: string;
  author_name: string;
  budget_estimate: string;
  status: 'Soumis' | 'En cours' | 'Rejeté' | 'Validé';
  votes_count: number;
  image_url: string;
  created_at?: string;
}

export interface ParticipationComment {
  id: number;
  project_id: number;
  user_id?: number;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface Dossier {
  id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  type: string;
  category: string;
  status: 'EN_ATTENTE' | 'EN_ANALYSE' | 'ASSIGNE' | 'ATTENTE_DOCUMENTS' | 'VALIDE' | 'REJETE' | 'TERMINE' | 'Instruction'; // Garder Instruction pour la compatibilité temporaire
  date: string;
  description: string;
  form_data: any; // Changé de formData à form_data
  formData?: any;
  resultUrl?: string;
  assigned_service?: MunicipalService;
  internal_notes?: string;
  service_feedback?: string;
  history?: { status: string; date: string; comment?: string }[];
  reason?: string; // Ajoutez cette ligne
    specific_info?: string; // Ajoutez cette ligne
}

// --- Services ---
export const ContentService = {
    getServices: async (): Promise<ServiceItem[]> => (await secureFetch(API_ENDPOINTS.CONTENT.SERVICES)).json(),
    addService: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.SERVICES, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateService: async (id: number, data: any) => (await secureFetch(`${API_ENDPOINTS.CONTENT.SERVICES}/${id}`, { method: 'PUT', body: JSON.stringify(data) })).json(),
    deleteService: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.SERVICES}/${id}`, { method: 'DELETE' }),
    getDocuments: async (): Promise<DocumentItem[]> => (await secureFetch(API_ENDPOINTS.CONTENT.DOCUMENTS)).json(),
    addDocument: async (formData: FormData) => (await secureFetch(API_ENDPOINTS.CONTENT.DOCUMENTS, { method: 'POST', body: formData })).json(),
    updateDocument: async (id: number, formData: FormData) => (await secureFetch(`${API_ENDPOINTS.CONTENT.DOCUMENTS}/${id}`, { method: 'PUT', body: formData })).json(),
    deleteDocument: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.DOCUMENTS}/${id}`, { method: 'DELETE' }),
    getProcedures: async (): Promise<ProcedureItem[]> => {
        const res = await secureFetch(API_ENDPOINTS.CONTENT.PROCEDURES);
        const data: ProcedureItem[] = await res.json();
        return Array.isArray(data) ? data.map(p => ({
            ...p,
            delay: p.delay || (p.category === 'État Civil' ? '48h' : '15 jours'),
            requiredDocs: p.requiredDocs || ['Pièce d\'identité', 'Justificatif de domicile'],
            isOnline: p.isOnline !== undefined ? p.isOnline : true
        })) : [];
    },
    addProcedure: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.PROCEDURES, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateProcedure: async (id: number, data: any) => secureFetch(`${API_ENDPOINTS.CONTENT.PROCEDURES}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProcedure: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.PROCEDURES}/${id}`, { method: 'DELETE' }),
    getProjects: async (): Promise<ProjectItem[]> => (await secureFetch(API_ENDPOINTS.CONTENT.PROJECTS)).json(),
    addProject: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.PROJECTS, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateProject: async (id: number, data: any) => secureFetch(`${API_ENDPOINTS.CONTENT.PROJECTS}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProject: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.PROJECTS}/${id}`, { method: 'DELETE' }),
    getNeighborhoods: async (): Promise<Neighborhood[]> => (await secureFetch(API_ENDPOINTS.CONTENT.NEIGHBORHOODS)).json(),
    addNeighborhood: async (data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(API_ENDPOINTS.CONTENT.NEIGHBORHOODS, { method: 'POST', body })).json();
    },
    updateNeighborhood: async (id: number, data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(`${API_ENDPOINTS.CONTENT.NEIGHBORHOODS}/${id}`, { method: 'PUT', body })).json();
    },
    deleteNeighborhood: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.NEIGHBORHOODS}/${id}`, { method: 'DELETE' }),
    getAbout: async (): Promise<AboutSection[]> => (await secureFetch(API_ENDPOINTS.CONTENT.ABOUT)).json(),
    addAbout: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.ABOUT, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateAbout: async (id: number, data: any) => secureFetch(`${API_ENDPOINTS.CONTENT.ABOUT}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAbout: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.ABOUT}/${id}`, { method: 'DELETE' }),
    getAboutStats: async (): Promise<AboutStat[]> => (await secureFetch(API_ENDPOINTS.CONTENT.ABOUT_STATS)).json(),
    addAboutStat: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.ABOUT_STATS, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateAboutStat: async (id: number, data: any) => secureFetch(`${API_ENDPOINTS.CONTENT.ABOUT_STATS}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAboutStat: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.ABOUT_STATS}/${id}`, { method: 'DELETE' }),
    seedData: async () => secureFetch(API_ENDPOINTS.CONTENT.SEED, { method: 'POST' })
};

export const ArticleService = {
  getAll: async (page = 1, limit = 9, category = 'Tout'): Promise<PaginatedArticles> => {
    const url = new URL(API_ENDPOINTS.ARTICLES.BASE, window.location.origin);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (category && category !== 'Tout') url.searchParams.append('category', category);
    return (await secureFetch(url.toString())).json();
  },
  getById: async (id: number): Promise<Article> => (await secureFetch(`${API_ENDPOINTS.ARTICLES.BASE}/${id}`)).json(),
  add: async (article: any) => {
    const body = article instanceof FormData ? article : JSON.stringify(article);
    return (await secureFetch(API_ENDPOINTS.ARTICLES.BASE, { method: 'POST', body })).json();
  },
  update: async (id: number, article: any) => {
    const body = article instanceof FormData ? article : JSON.stringify(article);
    return (await secureFetch(`${API_ENDPOINTS.ARTICLES.BASE}/${id}`, { method: 'PUT', body })).json();
  },
  delete: async (id: number) => secureFetch(`${API_ENDPOINTS.ARTICLES.BASE}/${id}`, { method: 'DELETE' }),
  reset: async () => secureFetch(`${API_ENDPOINTS.ARTICLES.BASE}/reset`, { method: 'POST' })
};

export const ReportingService = {
    submit: async (report: any) => (await secureFetch(API_ENDPOINTS.REPORTS.BASE, { method: 'POST', body: JSON.stringify(report) })).json(),
    getAll: async (): Promise<Report[]> => (await secureFetch(API_ENDPOINTS.REPORTS.BASE)).json(),
    updateStatus: async (id: number, status: string) => secureFetch(`${API_ENDPOINTS.REPORTS.BASE}/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    treat: async (id: number, data: { status: string; assigned_service: string }) => secureFetch(`${API_ENDPOINTS.REPORTS.BASE}/${id}/treat`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.REPORTS.BASE}/${id}`, { method: 'DELETE' })
};

export const ContactService = {
    send: async (msg: any) => (await secureFetch(API_ENDPOINTS.MESSAGES.BASE, { method: 'POST', body: JSON.stringify(msg) })).json(),
    getAll: async (): Promise<Message[]> => (await secureFetch(API_ENDPOINTS.MESSAGES.BASE)).json(),
    updateStatus: async (id: number, status: string) => secureFetch(`${API_ENDPOINTS.MESSAGES.BASE}/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.MESSAGES.BASE}/${id}`, { method: 'DELETE' })
};

export const DossierService = {
    getAll: async (): Promise<Dossier[]> => (await secureFetch(API_ENDPOINTS.DOSSIERS.BASE)).json(),
    getById: async (id: string): Promise<Dossier> => (await secureFetch(`${API_ENDPOINTS.DOSSIERS.BASE}/${id}`)).json(),
    getByUser: async (userId: string): Promise<Dossier[]> => (await secureFetch(`${API_ENDPOINTS.DOSSIERS.BASE}/user/${userId}`)).json(),
    create: async (data: any) => (await secureFetch(API_ENDPOINTS.DOSSIERS.BASE, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateStatus: async (id: string, status: string, comment?: string) => secureFetch(`${API_ENDPOINTS.DOSSIERS.BASE}/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, comment }) }),
    treat: async (id: string, data: { status: string; assigned_service: string; internal_notes?: string; service_feedback?: string }) => 
        secureFetch(`${API_ENDPOINTS.DOSSIERS.BASE}/${id}/treat`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id: string) => secureFetch(`${API_ENDPOINTS.DOSSIERS.BASE}/${id}`, { method: 'DELETE' })
};

export interface AuditLogItem {
    id: number;
    user_id: number;
    user_name?: string;
    action: string;
    target_type: string;
    target_id: string;
    details: string;
    ip_address: string;
    created_at: string;
}

export interface SiteSettingItem {
    id: number;
    setting_key: string;
    setting_value: string;
    setting_group: string;
    updated_at: string;
}

export const UserService = {
    getAll: async () => (await secureFetch(API_ENDPOINTS.AUTH.USERS)).json(),
    getMe: async () => (await secureFetch(API_ENDPOINTS.AUTH.ME)).json(),
    login: async (credentials: any) => {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Erreur de connexion');
        }
        return res.json();
    },
    register: async (userData: any) => {
        const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Erreur d\'inscription');
        }
        return res.json();
    },
    add: async (userData: any) => (await secureFetch(API_ENDPOINTS.AUTH.REGISTER, { method: 'POST', body: JSON.stringify(userData) })).json(),
    update: async (id: string, data: any) => (await secureFetch(`${API_ENDPOINTS.AUTH.USERS}/${id}`, { method: 'PUT', body: JSON.stringify(data) })).json(),
    resetPassword: async (id: string, newPassword: string) => (await secureFetch(`${API_ENDPOINTS.AUTH.USERS}/${id}/reset-password`, { method: 'PUT', body: JSON.stringify({ newPassword }) })).json(),
    delete: async (id: string) => secureFetch(`${API_ENDPOINTS.AUTH.USERS}/${id}`, { method: 'DELETE' })
};

export const SystemService = {
    getLogs: async (): Promise<AuditLogItem[]> => (await secureFetch(`${API_URL}/system/logs`)).json(),
    getSettings: async (): Promise<SiteSettingItem[]> => (await secureFetch(`${API_URL}/system/settings`)).json(),
    updateSettings: async (settings: Record<string, string>) => (await secureFetch(`${API_URL}/system/settings`, { method: 'PUT', body: JSON.stringify(settings) })).json()
};

export const CouncilService = {
    getMembers: async (): Promise<CouncilMember[]> => (await secureFetch(API_ENDPOINTS.COUNCIL.MEMBERS)).json(),
    addMember: async (data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(API_ENDPOINTS.COUNCIL.MEMBERS, { method: 'POST', body })).json();
    },
    updateMember: async (id: number, data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(`${API_ENDPOINTS.COUNCIL.MEMBERS}/${id}`, { method: 'PUT', body })).json();
    },
    deleteMember: async (id: number) => secureFetch(`${API_ENDPOINTS.COUNCIL.MEMBERS}/${id}`, { method: 'DELETE' }),
    getSessions: async (): Promise<CouncilSession[]> => (await secureFetch(API_ENDPOINTS.COUNCIL.SESSIONS)).json(),
    addSession: async (data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(API_ENDPOINTS.COUNCIL.SESSIONS, { method: 'POST', body })).json();
    },
    updateSession: async (id: number, data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(`${API_ENDPOINTS.COUNCIL.SESSIONS}/${id}`, { method: 'PUT', body })).json();
    },
    deleteSession: async (id: number) => secureFetch(`${API_ENDPOINTS.COUNCIL.SESSIONS}/${id}`, { method: 'DELETE' })
};

export interface ImageItem {
  id: number;
   title: string; // Ajoutez cette ligne si manquante
  url: string;
  name: string;
  category: string;
  date: string;
}

export const ImageService = {
    getAll: async (): Promise<ImageItem[]> => (await secureFetch(API_ENDPOINTS.CONTENT.IMAGES)).json(),
    add: async (data: any) => (await secureFetch(API_ENDPOINTS.CONTENT.IMAGES, { method: 'POST', body: JSON.stringify(data) })).json(),
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.CONTENT.IMAGES}/${id}`, { method: 'DELETE' }),
    getSystemImages: async (): Promise<Record<string, string>> => (await secureFetch(API_ENDPOINTS.CONTENT.SYSTEM_IMAGES)).json(),
    setSystem: async (key: string, url: string) => secureFetch(API_ENDPOINTS.CONTENT.SYSTEM_IMAGES, { method: 'POST', body: JSON.stringify({ key, url }) })
};

export const EventService = {
    getAll: async (): Promise<Event[]> => (await secureFetch(API_ENDPOINTS.EVENTS.BASE)).json(),
    getById: async (id: number): Promise<Event> => (await secureFetch(`${API_ENDPOINTS.EVENTS.BASE}/${id}`)).json(),
    add: async (data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(API_ENDPOINTS.EVENTS.BASE, { method: 'POST', body })).json();
    },
    update: async (id: number, data: any) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return (await secureFetch(`${API_ENDPOINTS.EVENTS.BASE}/${id}`, { method: 'PUT', body })).json();
    },
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.EVENTS.BASE}/${id}`, { method: 'DELETE' })
};

export const ProjectService = {
    getAll: async (): Promise<ProjectItem[]> => (await secureFetch(API_ENDPOINTS.PROJECTS.BASE)).json(),
    getByType: async (type: string): Promise<ProjectItem[]> => (await secureFetch(API_ENDPOINTS.PROJECTS.TYPE(type))).json(),
    getStats: async (): Promise<ProjectStats> => (await secureFetch(API_ENDPOINTS.PROJECTS.STATS)).json(),
    getById: async (id: number): Promise<ProjectItem> => (await secureFetch(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`)).json(),
    add: async (data: Partial<ProjectItem>) => (await secureFetch(API_ENDPOINTS.PROJECTS.BASE, { method: 'POST', body: JSON.stringify(data) })).json(),
    update: async (id: number, data: Partial<ProjectItem>) => secureFetch(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`, { method: 'DELETE' })
};

export const ParticipationService = {
    getProjects: async (): Promise<ParticipationProject[]> => (await secureFetch(API_ENDPOINTS.PARTICIPATION.PROJECTS)).json(),
    submitProject: async (data: any) => (await secureFetch(API_ENDPOINTS.PARTICIPATION.PROJECTS, { method: 'POST', body: JSON.stringify(data) })).json(),
    vote: async (id: number) => secureFetch(`${API_ENDPOINTS.PARTICIPATION.PROJECTS}/${id}/vote`, { method: 'POST' }),
    getComments: async (id: number): Promise<ParticipationComment[]> => (await secureFetch(`${API_ENDPOINTS.PARTICIPATION.PROJECTS}/${id}/comments`)).json(),
    addComment: async (id: number, data: { user_name: string; comment: string }) => (await secureFetch(`${API_ENDPOINTS.PARTICIPATION.PROJECTS}/${id}/comments`, { method: 'POST', body: JSON.stringify(data) })).json(),
    updateStatus: async (id: number, status: string) => secureFetch(`${API_ENDPOINTS.PARTICIPATION.PROJECTS}/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: async (id: number) => secureFetch(`${API_ENDPOINTS.PARTICIPATION.PROJECTS}/${id}`, { method: 'DELETE' })
};
