import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEdit2, FiTrash2, FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import { Lead, LeadStatus, LeadSource } from '../data/types';
import { getStatusColor, getSourceIcon } from '../utils/helpers';
import { formatDate } from '../utils/storage';

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Facebook', 'Instagram', 'Google Ads', 'Referral', 'LinkedIn'];

export function LeadTable({ leads, onView, onEdit, onDelete }: LeadTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = leads.filter(l => {
    const term = search.toLowerCase();
    const matchSearch = !term || l.fullName.toLowerCase().includes(term) || l.email.toLowerCase().includes(term) || l.company.toLowerCase().includes(term);
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchSource = !sourceFilter || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const confirmDelete = (id: string) => setDeleteId(id);
  const doDelete = () => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field pl-9 pr-8 py-2.5 text-sm appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="input-field pr-8 py-2.5 text-sm appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>

      <div className="text-slate-500 text-xs">
        Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{' '}
        <span className="text-slate-300 font-medium">{leads.length}</span> leads
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Lead</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">Phone</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">Source</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">Date</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="text-slate-500 text-sm">No leads found matching your filters.</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                            {lead.fullName[0]}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{lead.fullName}</div>
                            <div className="text-slate-500 text-xs">{lead.email}</div>
                            <div className="text-slate-600 text-xs sm:hidden">{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-slate-400 text-sm">{lead.phone}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-slate-400 text-sm flex items-center gap-1.5">
                          <span>{getSourceIcon(lead.source)}</span>
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-slate-500 text-xs">{formatDate(lead.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onView(lead)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(lead)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(lead.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-sm w-full border border-red-500/20"
            >
              <div className="w-12 h-12 bg-red-500/15 rounded-xl flex items-center justify-center mb-4">
                <FiTrash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Delete Lead</h3>
              <p className="text-slate-400 text-sm mb-6">This action cannot be undone. The lead will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                <button onClick={doDelete} className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
