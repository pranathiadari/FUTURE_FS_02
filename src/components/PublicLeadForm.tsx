import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiBriefcase,
  FiMessageSquare, FiCheckCircle, FiSend,
} from 'react-icons/fi';
import { Lead, LeadSource, LeadStatus } from '../data/types';
import { getLeads, saveLeads, generateId } from '../utils/storage';
import { validateEmail, validatePhone } from '../utils/helpers';

const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Facebook', 'Instagram', 'Google Ads', 'Referral', 'LinkedIn'];
const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const empty = {
  fullName: '', email: '', phone: '', company: '',
  source: 'Website' as LeadSource, status: 'New' as LeadStatus, notes: '',
};

export function PublicLeadForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.company.trim()) e.company = 'Company is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const lead: Lead = {
      id: generateId(),
      ...form,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const existing = getLeads();
    saveLeads([lead, ...existing]);

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(empty);
    setErrors({});
    setSubmitted(false);
  };

  const Field = ({
    id, label, icon: Icon, error, children,
  }: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-0.5">{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="w-full h-full flex flex-col justify-center"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          <FiSend className="w-3 h-3" />
          Quick Lead Submission
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Submit a Lead</h2>
        <p className="text-slate-400 text-sm">Fill in the details and our team will follow up promptly.</p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl p-8 text-center border border-green-500/20 flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="w-16 h-16 bg-green-500/15 rounded-2xl flex items-center justify-center"
            >
              <FiCheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Lead Submitted!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Thanks, <span className="text-white font-medium">{form.fullName.split(' ')[0]}</span>! We've received your details and will be in touch shortly.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn-ghost text-sm py-2.5 px-6 mt-1"
            >
              Submit another lead
            </button>
          </motion.div>
        ) : (
          /* ── Form ── */
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-5 space-y-3.5"
          >
            {/* Full Name */}
            <Field id="fullName" label="Full Name *" icon={FiUser} error={errors.fullName}>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="John Smith"
                className={`input-field pl-9 py-2.5 text-sm ${errors.fullName ? 'border-red-500/60' : ''}`}
              />
            </Field>

            {/* Email */}
            <Field id="email" label="Email Address *" icon={FiMail} error={errors.email}>
              <input
                id="email"
                type="text"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="john@company.com"
                className={`input-field pl-9 py-2.5 text-sm ${errors.email ? 'border-red-500/60' : ''}`}
              />
            </Field>

            {/* Phone + Company in a row */}
            <div className="grid grid-cols-2 gap-3">
              <Field id="phone" label="Phone *" icon={FiPhone} error={errors.phone}>
                <input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+1 555 0000"
                  className={`input-field pl-9 py-2.5 text-sm ${errors.phone ? 'border-red-500/60' : ''}`}
                />
              </Field>
              <Field id="company" label="Company *" icon={FiBriefcase} error={errors.company}>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="Acme Corp"
                  className={`input-field pl-9 py-2.5 text-sm ${errors.company ? 'border-red-500/60' : ''}`}
                />
              </Field>
            </div>

            {/* Source + Status in a row */}
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
            <Field id="notes" label="Notes" icon={FiMessageSquare} error={errors.notes}>
              <textarea
                id="notes"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any additional information..."
                rows={2}
                className="input-field pl-9 py-2.5 text-sm resize-none"
                style={{ paddingTop: '10px' }}
              />
            </Field>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="btn-primary w-full py-3 text-sm shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <><FiSend className="w-4 h-4" /> Submit Lead</>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-slate-600 text-xs text-center mt-4">
        Your information is kept secure and never shared with third parties.
      </p>
    </motion.div>
  );
}
