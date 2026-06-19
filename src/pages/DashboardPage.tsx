import { motion } from 'framer-motion';
import {
  FiUsers, FiUserPlus, FiPhoneCall, FiTrendingUp,
  FiActivity, FiBarChart2, FiArrowRight,
} from 'react-icons/fi';
import { StatsCard } from '../components/StatsCard';
import { Lead } from '../data/types';
import { getStatusColor, getSourceIcon } from '../utils/helpers';
import { formatDate } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  leads: Lead[];
}

export function DashboardPage({ leads }: DashboardPageProps) {
  const navigate = useNavigate();

  const stats = {
    total: leads.length,
    newLeads: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const pipelineData = [
    { label: 'New', count: stats.newLeads, color: 'bg-blue-500', pct: stats.total ? (stats.newLeads / stats.total) * 100 : 0 },
    { label: 'Contacted', count: stats.contacted, color: 'bg-yellow-500', pct: stats.total ? (stats.contacted / stats.total) * 100 : 0 },
    { label: 'Qualified', count: leads.filter(l => l.status === 'Qualified').length, color: 'bg-purple-500', pct: stats.total ? (leads.filter(l => l.status === 'Qualified').length / stats.total) * 100 : 0 },
    { label: 'Converted', count: stats.converted, color: 'bg-green-500', pct: stats.total ? (stats.converted / stats.total) * 100 : 0 },
    { label: 'Lost', count: leads.filter(l => l.status === 'Lost').length, color: 'bg-red-500', pct: stats.total ? (leads.filter(l => l.status === 'Lost').length / stats.total) * 100 : 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Good morning! 👋</h2>
          <p className="text-slate-400 text-sm mt-0.5">Here's what's happening with your leads today.</p>
        </div>
        <button
          onClick={() => navigate('/leads/add')}
          className="btn-primary py-2.5 text-sm shadow-lg shadow-blue-500/20 hidden sm:flex"
        >
          <FiUserPlus className="w-4 h-4" />
          Add Lead
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Leads"
          value={stats.total}
          icon={FiUsers}
          color="text-blue-400"
          bgColor="bg-blue-500/15"
          change="12%"
          changeUp
          index={0}
        />
        <StatsCard
          label="New Leads"
          value={stats.newLeads}
          icon={FiUserPlus}
          color="text-purple-400"
          bgColor="bg-purple-500/15"
          change="8%"
          changeUp
          index={1}
        />
        <StatsCard
          label="Contacted"
          value={stats.contacted}
          icon={FiPhoneCall}
          color="text-yellow-400"
          bgColor="bg-yellow-500/15"
          change="3%"
          changeUp={false}
          index={2}
        />
        <StatsCard
          label="Converted"
          value={stats.converted}
          icon={FiTrendingUp}
          color="text-green-400"
          bgColor="bg-green-500/15"
          change="22%"
          changeUp
          index={3}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold">Recent Leads</h3>
              <p className="text-slate-500 text-xs mt-0.5">Latest additions to your pipeline</p>
            </div>
            <button
              onClick={() => navigate('/leads')}
              className="text-primary text-xs font-medium flex items-center gap-1 hover:text-primary-light transition-colors"
            >
              View all <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-3 glass-light rounded-xl px-4 py-3"
              >
                <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                  {lead.fullName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{lead.fullName}</div>
                  <div className="text-slate-500 text-xs truncate">{lead.company}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-600 text-xs hidden sm:block">{getSourceIcon(lead.source)}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="text-slate-600 text-xs hidden md:block flex-shrink-0">{formatDate(lead.createdAt)}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pipeline overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <FiActivity className="w-4 h-4 text-primary" />
            <h3 className="text-white font-semibold">Pipeline Overview</h3>
          </div>
          <div className="space-y-4">
            {pipelineData.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-400 text-xs">{item.label}</span>
                  <span className="text-slate-300 text-xs font-semibold">{item.count}</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="w-full mt-6 btn-ghost py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <FiBarChart2 className="w-4 h-4" />
            Full Analytics
          </button>
        </motion.div>
      </div>
    </div>
  );
}
