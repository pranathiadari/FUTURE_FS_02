import { motion } from 'framer-motion';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { Lead } from '../data/types';

interface AnalyticsPageProps {
  leads: Lead[];
}

export function AnalyticsPage({ leads }: AnalyticsPageProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-slate-400 text-sm mt-0.5">Insights and performance metrics for your pipeline</p>
      </motion.div>

      <AnalyticsCharts leads={leads} />
    </div>
  );
}
