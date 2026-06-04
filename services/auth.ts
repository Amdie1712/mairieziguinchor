
import { UserService, DossierService, Dossier } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'citoyen' | 'employe' | 'admin';
  assigned_service?: string;
}

const CURRENT_USER_KEY = 'mairie_current_user';

export const AuthService = {
  // Inscription
  register: async (user: Omit<User, 'id'>) => {
    const newUser = await UserService.register(user);
    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // Connexion
  login: async (email: string, pass: string) => {
    const user = await UserService.login({ email, password: pass });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/';
  },

  // Récupérer l'utilisateur courant (reste synchrone car depuis localStorage)
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Récupérer l'historique des dossiers
  // Fix: Use imported Dossier from api.ts which includes all possible status values ('Attente documents', 'Instruction', etc.)
  getHistory: async (): Promise<Dossier[]> => {
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    return await DossierService.getByUser(user.id);
  },

  // Créer un nouveau dossier
  createDossier: async (type: string, description: string) => {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    return await DossierService.create({ userId: user.id, type, description });
  },

  // Exporter les données (Sauvegarde)
  exportData: async () => {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    
    const history = await AuthService.getHistory();
    
    const data = {
        userProfile: user,
        dossierHistory: history,
        exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `mairie_export_${user?.name || 'citoyen'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};
