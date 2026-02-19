import api from '../lib/axios';
import { User, LicenseRequest, DeviceRequest, Feedback } from '../types';

export const platformService = {
  // --- Dashboard Super Admin ---
  getStats: async () => {
    return api.get('/admin/stats');
  },

  // --- Gestion Utilisateurs ---
  getUsers: async (search?: string) => {
    return api.get<User[]>('/admin/users', { params: { search } });
  },
  
  // Action: 'REVOKE' | 'ACTIVATE'
  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'REVOKED') => {
    return api.put(`/admin/users/${userId}/status`, { status });
  },

  // --- Gestion Licences ---
  getLicenseRequests: async () => {
    return api.get<LicenseRequest[]>('/admin/licenses');
  },
  
  // Action: 'APPROVE' | 'REJECT'
  processLicenseRequest: async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    return api.put(`/admin/licenses/${requestId}/status`, { status });
  },

  // --- Gestion Appareils (Android ID) ---
  getDeviceRequests: async () => {
    return api.get<DeviceRequest[]>('/admin/devices');
  },
  
  processDeviceRequest: async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    return api.put(`/admin/devices/${requestId}/status`, { status });
  },

  // --- Feedbacks Globaux ---
  getAllFeedbacks: async () => {
    return api.get<Feedback[]>('/admin/feedbacks');
  }
};
