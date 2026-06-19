export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type LeadSource = 'Website' | 'Facebook' | 'Instagram' | 'Google Ads' | 'Referral' | 'LinkedIn';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

export type UserRole = 'Administrator' | 'Manager' | 'Agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isAdmin: boolean;
}

export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
}

export interface StatsData {
  total: number;
  newLeads: number;
  contacted: number;
  converted: number;
}

export interface MonthlyData {
  month: string;
  leads: number;
  converted: number;
}

export interface SourceData {
  name: string;
  value: number;
  color: string;
}
