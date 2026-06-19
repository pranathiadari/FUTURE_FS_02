import { LeadStatus } from '../data/types';

export function getStatusColor(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    New: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Qualified: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    Converted: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Lost: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return map[status] || '';
}

export function getSourceIcon(source: string): string {
  const map: Record<string, string> = {
    Website: '🌐',
    Facebook: '📘',
    Instagram: '📸',
    'Google Ads': '🔍',
    Referral: '🤝',
    LinkedIn: '💼',
  };
  return map[source] || '📌';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}
