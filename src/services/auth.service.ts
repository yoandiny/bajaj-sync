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

    // 🔍 DIAGNOSTIC: Voir la réponse complète du serveur après login
    console.log('[LOGIN] Réponse serveur - user:', user);
    console.log('[LOGIN] Réponse serveur - token (brut):', token);

    // Décoder le token pour voir son contenu
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[LOGIN] Token décodé:', payload);
      console.log('[LOGIN] office_id dans le token:', payload.office_id);
      console.log('[LOGIN] company_id dans le token:', payload.company_id);
    } catch (e) {
      console.error('[LOGIN] Impossible de décoder le token:', e);
    }

    // Ce qui est stocké dans localStorage
    const stored = { ...user, token };
    console.log('[LOGIN] Stocké dans localStorage (bajajsync_user):', stored);
    localStorage.setItem('bajajsync_user', JSON.stringify(stored));
    return response.data;
  },

  registerWeb: async (data: any): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register-web', data);
    const { token, user } = response.data;
    localStorage.setItem('bajajsync_user', JSON.stringify({ ...user, token }));
    return response.data;
  },

  submitPayment: async (data: { paymentPhone: string, reference: string, paymentMethod: string, amount: number }): Promise<any> => {
    const response = await api.post('/auth/submit-payment', data);
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
  },

  getConfig: async (): Promise<any> => {
    const response = await api.get('/config');
    return response.data;
  },

  getSettings: async (): Promise<any[]> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSetting: async (key: string, value: string): Promise<void> => {
    await api.put(`/admin/settings/${key}`, { value });
  },

  getFeedbacks: async (): Promise<any[]> => {
    const response = await api.get('/admin/feedbacks');
    return response.data;
  }
};
