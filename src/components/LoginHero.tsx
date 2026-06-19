import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiBell, FiTrendingUp } from 'react-icons/fi';

const features = [
  { icon: FiUsers, label: 'Lead Tracking', desc: 'Centralize all your prospects' },
  { icon: FiBell, label: 'Status Updates', desc: 'Real-time pipeline visibility' },
  { icon: FiBarChart2, label: 'Follow-Up Notes', desc: 'Never miss a touchpoint' },
  { icon: FiTrendingUp, label: 'Analytics Dashboard', desc: 'Data-driven decisions' },
];

export function LoginHero() {
  return (
    <div className="relative h-full flex flex-col justify-center px-12 py-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-dark-900 to-accent-dark/20" />
      
      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 -right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-3/4 left-1/3 w-64 h-64 bg-green-500/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <div>
            <div className="text-white font-bold text-xl">CRM Pro</div>
            <div className="text-slate-400 text-xs">Enterprise Edition</div>
          </div>
        </motion.div>

        {/* Hero illustration — animated chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-10 border border-white/10"
        >
          <div className="flex items-end gap-2 h-24 mb-3">
            {[40, 65, 45, 80, 55, 90, 70, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                style={{ height: `${h}%`, originY: 1 }}
                className={`flex-1 rounded-t-md ${i === 7 ? 'gradient-primary' : 'bg-slate-600/60'}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Lead Growth — 2024</span>
            <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" /> +34.2%
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white leading-tight mb-3">
            Client Lead <br />
            <span className="text-gradient">Management System</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Manage leads, track conversions, and grow your business efficiently.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="glass-light rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mb-2.5 shadow-md shadow-blue-500/20">
                <f.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-white text-sm font-semibold">{f.label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-700/50"
        >
          {[['500+', 'Companies'], ['12K+', 'Leads Tracked'], ['98%', 'Uptime']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-white font-bold text-lg">{num}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
