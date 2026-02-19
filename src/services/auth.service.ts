import api from '../lib/axios';
import { User } from '../types';

export const authService = {
  // Connexion
  login: async (identifier: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', { identifier, password });
    if (response.data.token) {
        // On stocke l'utilisateur et le token ensemble ou séparément selon la préférence
        // Ici on simule l'ajout du token à l'objet user pour le stockage local
        const userWithToken = { ...response.data.user, token: response.data.token };
        localStorage.setItem('bajajsync_user', JSON.stringify(userWithToken));
    }
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error("Erreur lors du logout serveur", e);
    } finally {
        localStorage.removeItem('bajajsync_user');
    }
  },

  // Vérification de session (au rechargement de la page)
  me: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  }
};
