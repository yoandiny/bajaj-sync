export type Role = 'ADMIN' | 'MANAGER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: Role;
  officeId?: string; // Null if Admin or Unassigned Manager
}

export interface OfficeSettings {
  dailyTargetAmount: number;
  restDay: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface Office {
  id: string;
  name: string;
  location: string;
  managerId: string;
  settings?: OfficeSettings;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  officeId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'BAJAJ' | 'TAXI' | 'MOTO';
  model: string;
  officeId: string;
  titularDriverId?: string;
  replacementDriverId?: string;
  insuranceExpiry: string;
  techVisitExpiry: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'STOPPED';
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  vehicleId: string;
  driverId: string;
  officeId: string;
  isRestDay: boolean;
  notes?: string;
}

export type ExpenseScope = 'GENERAL' | 'VEHICLE' | 'DRIVER' | 'BOTH';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  scope: ExpenseScope;
  vehicleId?: string;
  driverId?: string;
  officeId: string;
  description?: string;
}
