import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiPhone, FiBriefcase, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { Lead } from '../data/types';
import { getStatusColor, getSourceIcon } from '../utils/helpers';
import { formatDate } from '../utils/storage';

interface LeadViewModalProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

export function LeadViewModal({ lead, onClose, onEdit }: LeadViewModalProps) {
  return (
    <AnimatePresence>
      {lead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="glass rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {lead.fullName[0]}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{lead.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className="text-slate-500 text-xs">{getSourceIcon(lead.source)} {lead.source}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              {[
                { icon: FiMail, label: 'Email', value: lead.email },
                { icon: FiPhone, label: 'Phone', value: lead.phone },
                { icon: FiBriefcase, label: 'Company', value: lead.company },
                { icon: FiCalendar, label: 'Date Added', value: formatDate(lead.createdAt) },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 glass-light rounded-xl px-4 py-3">
                  <item.icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div>
                    <div className="text-slate-500 text-xs">{item.label}</div>
                    <div className="text-slate-200 text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
              {lead.notes && (
                <div className="flex items-start gap-3 glass-light rounded-xl px-4 py-3">
                  <FiMessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Notes</div>
                    <div className="text-slate-300 text-sm leading-relaxed">{lead.notes}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">Close</button>
              <button
                onClick={() => { onEdit(lead); onClose(); }}
                className="btn-primary flex-1 py-2.5 text-sm"
              >
                Edit Lead
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
