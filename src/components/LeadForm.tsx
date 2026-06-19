import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare, FiX } from 'react-icons/fi';
import { Lead, LeadSource, LeadStatus } from '../data/types';
import { generateId } from '../utils/storage';
import { validateEmail, validatePhone } from '../utils/helpers';

interface LeadFormProps {
  onSave: (lead: Lead) => void;
  editLead?: Lead | null;
  onCancelEdit?: () => void;
}

const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Facebook', 'Instagram', 'Google Ads', 'Referral', 'LinkedIn'];
const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const empty = {
  fullName: '', email: '', phone: '', company: '',
  source: 'Website' as LeadSource, status: 'New' as LeadStatus, notes: '',
};

export function LeadForm({ onSave, editLead, onCancelEdit }: LeadFormProps) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editLead) {
      setForm({
        fullName: editLead.fullName,
        email: editLead.email,
        phone: editLead.phone,
        company: editLead.company,
        source: editLead.source,
        status: editLead.status,
        notes: editLead.notes,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [editLead]);

  const set = (key: string, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.company.trim()) e.company = 'Company name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const lead: Lead = {
      id: editLead?.id ?? generateId(),
      ...form,
      createdAt: editLead?.createdAt ?? new Date().toISOString().split('T')[0],
    };
    onSave(lead);
    if (!editLead) {
      setForm(empty);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleReset = () => {
    setForm(editLead ? {
      fullName: editLead.fullName, email: editLead.email, phone: editLead.phone,
      company: editLead.company, source: editLead.source, status: editLead.status, notes: editLead.notes,
    } : empty);
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {editLead ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {editLead ? 'Update lead information' : 'Fill in the details to add a lead'}
          </p>
        </div>
        {editLead && onCancelEdit && (
          <button onClick={onCancelEdit} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Success banner */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"
        >
          ✓ Lead added successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              placeholder="John Smith"
              className={`input-field pl-10 py-2.5 text-sm ${errors.fullName ? 'border-red-500/60' : ''}`}
            />
          </div>
          {errors.fullName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="john@company.com"
              className={`input-field pl-10 py-2.5 text-sm ${errors.email ? 'border-red-500/60' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number *</label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={`input-field pl-10 py-2.5 text-sm ${errors.phone ? 'border-red-500/60' : ''}`}
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone}</p>}
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name *</label>
          <div className="relative">
            <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={form.company}
              onChange={e => set('company', e.target.value)}
              placeholder="Acme Corp"
              className={`input-field pl-10 py-2.5 text-sm ${errors.company ? 'border-red-500/60' : ''}`}
            />
          </div>
          {errors.company && <p className="text-red-400 text-xs mt-1 ml-1">{errors.company}</p>}
        </div>

        {/* Source + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Lead Source</label>
            <select
              value={form.source}
              onChange={e => set('source', e.target.value)}
              className="input-field py-2.5 text-sm appearance-none cursor-pointer"
            >
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="input-field py-2.5 text-sm appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
          <div className="relative">
            <FiMessageSquare className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Add any relevant notes..."
              rows={3}
              className="input-field pl-10 py-2.5 text-sm resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1 py-2.5 text-sm shadow-md shadow-blue-500/20">
            {editLead ? 'Update Lead' : 'Save Lead'}
          </button>
          <button type="button" onClick={handleReset} className="btn-ghost py-2.5 text-sm px-5">
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
}
