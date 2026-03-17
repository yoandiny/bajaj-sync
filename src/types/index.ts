export type Role = 'OWNER' | 'MANAGER' | 'SUPER_ADMIN' | 'DRIVER';

export interface User {
  id: string;
  identifier: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: Role;
  role_id: number;
  company_id: string;
  office_id?: string;
  officeId?: string;
  officeName?: string;
  status: 'active' | 'waiting' | 'pending' | 'ACTIVE' | 'REVOKED';
  companyStatus: 'active' | 'waiting' | 'pending' | 'suspended';
  company_status?: 'active' | 'pending' | 'suspended';
  subscriptionPlan?: 'TRIAL' | 'PREMIUM';
  subscriptionUntil?: string;
  joinedDate?: string | Date | number;
  photoUrl?: string;
}


export interface OfficeSettings {
  dailyTargetAmount: number;
  restDay: number | null; // 0 = Sunday, 1 = Monday, ..., null = No rest day
  paymentCycle?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  paymentMode?: 'FIXED' | 'VARIABLE';
}

export interface Office {
  id: string;
  name: string;
  location: string;
  managerId: string;
  companyId?: string;
  settings?: OfficeSettings;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  cin?: string;
  officeId: string;
  vehicleId?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  vehicleRole?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  debt: number;
  photoUrl?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  name?: string;
  model: string;
  type: 'BAJAJ' | 'MOTO' | 'BUS' | 'OTHER';
  status: 'ACTIVE' | 'MAINTENANCE' | 'STOPPED';
  officeId: string;
  companyId?: string;
  titularDriverId?: string;
  replacementDriverId?: string;
  insuranceExpiry: string;
  techVisitExpiry: string;
  insuranceUrl?: string;
  registrationUrl?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  vehicleId: string;
  driverId: string;
  officeId: string;
  officeName?: string;
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
  officeName?: string;
  description?: string;
}

// New Types for Platform Admin
export interface LicenseRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  paymentMethod: string;
  reference: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface DeviceRequest {
  id: string;
  userId: string;
  userName: string;
  currentDeviceId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  message: string;
  rating: number; // 1-5
  date: string;
}

// Subscription & Billing Types
export interface SubscriptionTransaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  method: 'ORANGE_MONEY' | 'MVOLA';
  reference: string;
  period: string; // e.g. "Avril 2025"
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'TRIAL' | 'PREMIUM';
  nextBillingDate: string;
  amount: number;
}
