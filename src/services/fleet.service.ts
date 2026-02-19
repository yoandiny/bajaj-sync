import api from '../lib/axios';
import { Vehicle, Driver, Office, Payment, Expense, OfficeSettings } from '../types';

export const fleetService = {
  // --- Dashboard Stats ---
  getDashboardStats: async () => {
    return api.get('/dashboard/stats');
  },

  // --- Bureaux (Offices) ---
  getOffices: async () => {
    return api.get<Office[]>('/offices');
  },
  createOffice: async (data: Partial<Office>) => {
    return api.post<Office>('/offices', data);
  },
  updateOffice: async (id: string, data: Partial<Office>) => {
    return api.put<Office>(`/offices/${id}`, data);
  },
  deleteOffice: async (id: string) => {
    return api.delete(`/offices/${id}`);
  },

  // --- Véhicules ---
  getVehicles: async () => {
    return api.get<Vehicle[]>('/vehicles');
  },
  createVehicle: async (data: Partial<Vehicle>) => {
    return api.post<Vehicle>('/vehicles', data);
  },
  updateVehicle: async (id: string, data: Partial<Vehicle>) => {
    return api.put<Vehicle>(`/vehicles/${id}`, data);
  },
  deleteVehicle: async (id: string) => {
    return api.delete(`/vehicles/${id}`);
  },

  // --- Chauffeurs ---
  getDrivers: async () => {
    return api.get<Driver[]>('/drivers');
  },
  createDriver: async (data: Partial<Driver>) => {
    return api.post<Driver>('/drivers', data);
  },
  updateDriver: async (id: string, data: Partial<Driver>) => {
    return api.put<Driver>(`/drivers/${id}`, data);
  },
  deleteDriver: async (id: string) => {
    return api.delete(`/drivers/${id}`);
  },

  // --- Versements (Payments) ---
  getPayments: async (filters?: { date?: string; vehicleId?: string; driverId?: string }) => {
    return api.get<Payment[]>('/payments', { params: filters });
  },
  createPayment: async (data: Partial<Payment>) => {
    return api.post<Payment>('/payments', data);
  },

  // --- Dépenses (Expenses) ---
  getExpenses: async (filters?: { date?: string; category?: string }) => {
    return api.get<Expense[]>('/expenses', { params: filters });
  },
  createExpense: async (data: Partial<Expense>) => {
    return api.post<Expense>('/expenses', data);
  },

  // --- Paramètres Bureau ---
  getSettings: async (officeId: string) => {
    return api.get<OfficeSettings>(`/offices/${officeId}/settings`);
  },
  updateSettings: async (officeId: string, settings: OfficeSettings) => {
    return api.put<OfficeSettings>(`/offices/${officeId}/settings`, settings);
  }
};
