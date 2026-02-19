import { User, Office, Driver, Vehicle, Payment, Expense } from '../types';
import { generateUUID } from '../lib/utils';

// Mock Data for initial state

export const MOCK_OFFICES: Office[] = [
  { 
    id: 'off-1', 
    name: 'Siège Antananarivo', 
    location: 'Analakely, Tana', 
    managerId: 'usr-2',
    settings: { dailyTargetAmount: 40000, restDay: 0 } // 0 = Sunday
  },
  { 
    id: 'off-2', 
    name: 'Agence Tamatave', 
    location: 'Bord de mer, Toamasina', 
    managerId: 'usr-3',
    settings: { dailyTargetAmount: 35000, restDay: 0 }
  },
];

export const MOCK_USERS: User[] = [
  { id: 'usr-1', firstName: 'Admin', lastName: 'Principal', phone: '0340000000', role: 'ADMIN' },
  { id: 'usr-2', firstName: 'Jean', lastName: 'Rakoto', email: 'jean@bajajsync.mg', role: 'MANAGER', officeId: 'off-1' },
  { id: 'usr-3', firstName: 'Marie', lastName: 'Soa', phone: '0321111111', role: 'MANAGER', officeId: 'off-2' },
  { id: 'usr-4', firstName: 'Paul', lastName: 'Libre', phone: '0330000000', role: 'MANAGER', officeId: undefined }, // Unassigned Manager
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'drv-1', firstName: 'Rabe', lastName: 'Koto', phone: '0341234567', licenseNumber: 'PERMIS-001', officeId: 'off-1', status: 'ACTIVE' },
  { id: 'drv-2', firstName: 'Randria', lastName: 'Paul', phone: '0339876543', licenseNumber: 'PERMIS-002', officeId: 'off-1', status: 'INACTIVE' },
  { id: 'drv-3', firstName: 'Solo', lastName: 'Be', phone: '0325556667', licenseNumber: 'PERMIS-003', officeId: 'off-2', status: 'ACTIVE' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'veh-1', plate: '1234 TBE', type: 'BAJAJ', model: 'RE 4S', officeId: 'off-1', titularDriverId: 'drv-1', insuranceExpiry: '2025-12-31', techVisitExpiry: '2025-06-30', status: 'ACTIVE' },
  { id: 'veh-2', plate: '5678 TBG', type: 'BAJAJ', model: 'Maxima', officeId: 'off-2', titularDriverId: 'drv-3', insuranceExpiry: '2025-10-15', techVisitExpiry: '2025-05-20', status: 'MAINTENANCE' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: generateUUID(), date: new Date().toISOString().split('T')[0], amount: 40000, vehicleId: 'veh-1', driverId: 'drv-1', officeId: 'off-1', isRestDay: false },
  { id: generateUUID(), date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 35000, vehicleId: 'veh-2', driverId: 'drv-3', officeId: 'off-2', isRestDay: false },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: generateUUID(), date: new Date().toISOString().split('T')[0], amount: 15000, category: 'Carburant', scope: 'VEHICLE', vehicleId: 'veh-1', officeId: 'off-1', description: 'Plein essence' },
  { id: generateUUID(), date: new Date().toISOString().split('T')[0], amount: 5000, category: 'Divers', scope: 'GENERAL', officeId: 'off-1', description: 'Fournitures bureau' },
];
