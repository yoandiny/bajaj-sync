import api from '../lib/axios';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (identifier: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { identifier, password });
    const { token, user } = response.data;
    // Stocker token + user en localStorage pour les requêtes suivantes
    localStorage.setItem('bajajsync_user', JSON.stringify({ ...user, token }));
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  forgotPassword: async (phone: string): Promise<void> => {
    await api.post('/auth/forgot-password', { phone });
  }
};
