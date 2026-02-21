import api from '../lib/axios';
import { User, LicenseRequest, DeviceRequest, Feedback } from '../types';

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  pendingLicenses: number;
  totalFeedbacks: number;
}

export const platformService = {
  // Stats
  getStats: async (): Promise<PlatformStats> => {
    const response = await api.get<PlatformStats>('/admin/stats');
    return response.data;
  },

  // Users
  getUsers: async (search?: string): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users', { params: { search } });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'REVOKED'): Promise<void> => {
    await api.put(`/admin/users/${userId}/status`, { status });
  },

  // License Requests
  getLicenseRequests: async (): Promise<LicenseRequest[]> => {
    const response = await api.get<LicenseRequest[]>('/admin/licenses');
    return response.data;
  },

  processLicenseRequest: async (requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
    await api.put(`/admin/licenses/${requestId}/status`, { status });
  },

  // Device Requests
  getDeviceRequests: async (): Promise<DeviceRequest[]> => {
    const response = await api.get<DeviceRequest[]>('/admin/devices');
    return response.data;
  },

  processDeviceRequest: async (requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
    await api.put(`/admin/devices/${requestId}/status`, { status });
  },

  // Feedbacks
  getFeedbacks: async (): Promise<Feedback[]> => {
    const response = await api.get<Feedback[]>('/admin/feedbacks');
    return response.data;
  }
};
