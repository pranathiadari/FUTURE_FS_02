import { Lead, User, Account } from '../data/types';

const LEADS_KEY = 'crm_leads';
const USER_KEY = 'crm_user';
const AUTH_KEY = 'crm_auth';
const REMEMBER_KEY = 'crm_remember';
const ACCOUNTS_KEY = 'crm_accounts';

// ─── Leads ───────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function getAuthUser(): User | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_KEY, 'true');
}

export function clearAuth(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getRememberMe(): string {
  return localStorage.getItem(REMEMBER_KEY) || '';
}

export function setRememberMe(email: string): void {
  if (email) {
    localStorage.setItem(REMEMBER_KEY, email);
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

// ─── Accounts registry ────────────────────────────────────────────────────────

export function getAccounts(): Account[] {
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function seedAdminAccount(): void {
  const accounts = getAccounts();
  const adminExists = accounts.some(a => a.email === 'admin@crm.com');
  if (!adminExists) {
    const admin: Account = {
      id: 'admin-seed',
      email: 'admin@crm.com',
      passwordHash: btoa('admin123'),
      name: 'Admin User',
      role: 'Administrator',
      createdAt: new Date().toISOString().split('T')[0],
      isAdmin: true,
      isActive: true,
    };
    saveAccounts([admin, ...accounts]);
  }
}

export function findAccount(email: string, password: string): Account | null {
  const accounts = getAccounts();
  return accounts.find(a => a.email === email && a.passwordHash === btoa(password) && a.isActive) ?? null;
}

export function emailExists(email: string): boolean {
  return getAccounts().some(a => a.email === email);
}

export function addAccount(account: Account): void {
  const accounts = getAccounts();
  saveAccounts([...accounts, account]);
}

export function updateAccount(updated: Account): void {
  const accounts = getAccounts().map(a => (a.id === updated.id ? updated : a));
  saveAccounts(accounts);
}

export function deleteAccount(id: string): void {
  saveAccounts(getAccounts().filter(a => a.id !== id));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
