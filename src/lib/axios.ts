import axios from 'axios';

// URL de base de l'API (à configurer dans un fichier .env : VITE_API_URL=http://localhost:1000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1000';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('bajajsync_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Supposons que l'objet user contient un champ 'token'
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;

        // 🔍 DIAGNOSTIC: Décoder le token JWT pour voir son contenu
        try {
          const payload = JSON.parse(atob(user.token.split('.')[1]));
          console.log('[AUTH] Token payload (décodé):', payload);
          console.log('[AUTH] office_id dans le token:', payload.office_id);
          console.log('[AUTH] company_id dans le token:', payload.company_id);
          console.log('[AUTH] role_id dans le token:', payload.role_id);
        } catch (e) {
          console.error('[AUTH] Impossible de décoder le token:', e);
        }

        console.log('[AUTH] Header Authorization envoyé:', config.method?.toUpperCase(), config.url);
      } else {
        console.warn('[AUTH] ⚠️ Pas de token dans localStorage bajajsync_user');
        console.log('[AUTH] Contenu de bajajsync_user:', user);
      }
    } else {
      console.warn('[AUTH] ⚠️ bajajsync_user absent du localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globales (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si le token est expiré ou invalide, on déconnecte l'utilisateur
      localStorage.removeItem('bajajsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
