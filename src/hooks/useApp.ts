import { useState, useEffect } from 'react';
import {
  getAuthUser, setAuthUser, clearAuth, isAuthenticated,
  getLeads, saveLeads, seedAdminAccount, findAccount,
  emailExists, addAccount, generateId,
} from '../utils/storage';
import { sampleLeads } from '../data/sampleData';
import { User, Lead, Account, UserRole } from '../data/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    seedAdminAccount();
    if (isAuthenticated()) setUser(getAuthUser());
    if (getLeads().length === 0) saveLeads(sampleLeads);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    const account = findAccount(email, password);
    if (account) {
      const u: User = {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        isAdmin: account.isAdmin,
        createdAt: account.createdAt,
      };
      setAuthUser(u);
      setUser(u);
      setLoading(false);
      return true;
    }
    setError('Invalid email or password. Check your credentials and try again.');
    setLoading(false);
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'Agent'
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (emailExists(email)) {
      setLoading(false);
      return { success: false, message: 'An account with this email already exists.' };
    }
    const account: Account = {
      id: generateId(),
      email,
      passwordHash: btoa(password),
      name,
      role,
      createdAt: new Date().toISOString().split('T')[0],
      isAdmin: false,
      isActive: true,
    };
    addAccount(account);
    setLoading(false);
    return { success: true, message: 'Account created! You can now sign in.' };
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return { user, loading, error, setError, login, register, logout, isLoggedIn: !!user };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const stored = getLeads();
    if (stored.length === 0) {
      saveLeads(sampleLeads);
      setLeads(sampleLeads);
    } else {
      setLeads(stored);
    }
  }, []);

  const addLead = (lead: Lead) => {
    const updated = [lead, ...leads];
    setLeads(updated);
    saveLeads(updated);
  };

  const updateLead = (updated: Lead) => {
    const list = leads.map(l => (l.id === updated.id ? updated : l));
    setLeads(list);
    saveLeads(list);
  };

  const deleteLead = (id: string) => {
    const list = leads.filter(l => l.id !== id);
    setLeads(list);
    saveLeads(list);
  };

  return { leads, addLead, updateLead, deleteLead };
}
