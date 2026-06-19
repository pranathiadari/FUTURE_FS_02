import { useState } from 'react';
import { LeadTable } from '../components/LeadTable';
import { LeadForm } from '../components/LeadForm';
import { LeadViewModal } from '../components/LeadViewModal';
import { Lead } from '../data/types';
import { motion } from 'framer-motion';

interface LeadsPageProps {
  leads: Lead[];
  onAdd: (lead: Lead) => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
  showAddForm?: boolean;
}

export function LeadsPage({ leads, onAdd, onUpdate, onDelete, showAddForm = false }: LeadsPageProps) {
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(showAddForm);

  const handleSave = (lead: Lead) => {
    if (editLead) {
      onUpdate(lead);
      setEditLead(null);
      setShowForm(false);
    } else {
      onAdd(lead);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditLead(lead);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditLead(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Lead Management</h2>
          <p className="text-slate-400 text-sm mt-0.5">{leads.length} total leads in your pipeline</p>
        </div>
        <button
          onClick={() => { setEditLead(null); setShowForm(v => !v); }}
          className="btn-primary py-2.5 text-sm shadow-lg shadow-blue-500/20"
        >
          {showForm && !editLead ? '✕ Close' : '+ Add Lead'}
        </button>
      </motion.div>

      {/* Layout: form + table */}
      <div className={`${showForm ? 'flex flex-col xl:flex-row gap-6 items-start' : ''}`}>
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full xl:w-96 flex-shrink-0"
          >
            <LeadForm
              onSave={handleSave}
              editLead={editLead}
              onCancelEdit={editLead ? handleCancelEdit : undefined}
            />
          </motion.div>
        )}

        {/* Table */}
        <div className="flex-1 min-w-0">
          <LeadTable
            leads={leads}
            onView={setViewLead}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* View modal */}
      <LeadViewModal
        lead={viewLead}
        onClose={() => setViewLead(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
