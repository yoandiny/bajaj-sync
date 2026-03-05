import api from '../lib/axios';
import { SubscriptionTransaction, Feedback } from '../types';

export const userService = {
  // --- Profil ---
  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string; email?: string }) => {
    return api.put('/user/profile', data);
  },
  
  updatePassword: async (data: { current: string; new: string }) => {
    return api.put('/user/password', data);
  },

  // --- Abonnement ---
  getSubscriptionHistory: async () => {
    return api.get<SubscriptionTransaction[]>('/user/subscription/history');
  },
  
  declarePayment: async (data: { amount: number; method: string; reference: string; period: string }) => {
    return api.post<SubscriptionTransaction>('/user/subscription/declare', data);
  },

  suspendSubscription: async () => {
    return api.post('/user/subscription/suspend');
  },

  // --- Feedback ---
  sendFeedback: async (data: { message: string; rating: number }) => {
    return api.post<Feedback>('/user/feedback', data);
  }
};
