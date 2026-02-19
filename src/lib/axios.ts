import axios from 'axios';

// URL de base de l'API (à configurer dans un fichier .env : VITE_API_URL=https://api.votresite.com)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
      }
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
