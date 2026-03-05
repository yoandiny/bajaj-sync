import api from '../lib/axios';
import { Office, Vehicle, Driver, Payment, Expense, User } from '../types';

export const fleetService = {
  // Offices
  getOffices: async (): Promise<Office[]> => {
    const response = await api.get<Office[]>('/offices');
    return response.data;
  },
  createOffice: async (data: any): Promise<Office> => {
    const response = await api.post<Office>('/offices', data);
    return response.data;
  },
  updateOffice: async (id: string, data: any): Promise<Office> => {
    const response = await api.put<Office>(`/offices/${id}`, data);
    return response.data;
  },
  deleteOffice: async (id: string): Promise<void> => {
    await api.delete(`/offices/${id}`);
  },

  // Vehicles
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },
  createVehicle: async (data: any): Promise<Vehicle> => {
    console.log('fleetService.createVehicle - Payload:', data);
    const response = await api.post<Vehicle>('/vehicles', data);
    console.log('fleetService.createVehicle - Response:', response.data);
    return response.data;
  },
  updateVehicle: async (id: string, data: any): Promise<Vehicle> => {
    console.log(`fleetService.updateVehicle(${id}) - Payload:`, data);
    const response = await api.put<Vehicle>(`/vehicles/${id}`, data);
    console.log(`fleetService.updateVehicle(${id}) - Response:`, response.data);
    return response.data;
  },
  deleteVehicle: async (id: string): Promise<void> => {
    console.log(`fleetService.deleteVehicle(${id})`);
    await api.delete(`/vehicles/${id}`);
  },

  // Drivers
  getDrivers: async (): Promise<Driver[]> => {
    const response = await api.get<Driver[]>('/drivers');
    return response.data;
  },
  createDriver: async (data: any): Promise<Driver> => {
    console.log('fleetService.createDriver - Payload:', data);
    const response = await api.post<Driver>('/drivers', data);
    console.log('fleetService.createDriver - Response:', response.data);
    return response.data;
  },
  updateDriver: async (id: string, data: any): Promise<Driver> => {
    console.log(`fleetService.updateDriver(${id}) - Payload:`, data);
    const response = await api.put<Driver>(`/drivers/${id}`, data);
    console.log(`fleetService.updateDriver(${id}) - Response:`, response.data);
    return response.data;
  },
  deleteDriver: async (id: string): Promise<void> => {
    console.log(`fleetService.deleteDriver(${id})`);
    await api.delete(`/drivers/${id}`);
  },

  // Payments (Transactions type='PAYMENT')
  getPayments: async (params?: any): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments', { params });
    return response.data;
  },
  createPayment: async (data: any): Promise<Payment> => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  updatePayment: async (id: string, data: any): Promise<Payment> => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  // Expenses (Transactions type='EXPENSE')
  getExpenses: async (params?: any): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses', { params });
    return response.data;
  },
  createExpense: async (data: any): Promise<Expense> => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  sendFeedback: async (data: { message: string; rating: number }): Promise<void> => {
    await api.post('/user/feedback', data);
  },

  // Stats
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Office Settings
  getOfficeSettings: async (officeId: string): Promise<any> => {
    const response = await api.get(`/offices/${officeId}/settings`);
    return response.data;
  },
  updateOfficeSettings: async (officeId: string, settings: any): Promise<any> => {
    const response = await api.put(`/offices/${officeId}/settings`, settings);
    return response.data;
  },

  // Managers
  getManagers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/fleet/managers');
    return response.data;
  },
  createManager: async (data: any): Promise<User> => {
    const response = await api.post<User>('/fleet/managers', data);
    return response.data;
  },
  updateProfile: async (data: any): Promise<void> => {
    await api.put('/user/profile', data);
  },
  uploadFile: async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>(`/upload/${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },
};
