import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  change?: string;
  changeUp?: boolean;
  index?: number;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

export function StatsCard({ label, value, icon: Icon, color, bgColor, change, changeUp, index = 0 }: StatsCardProps) {
  const count = useCountUp(value, 1000 + index * 150);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-2xl p-5 card-hover cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            changeUp
              ? 'bg-green-500/15 text-green-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {changeUp ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className={`text-3xl font-bold ${color}`}>{count.toLocaleString()}</div>
        <div className="text-slate-400 text-sm font-medium">{label}</div>
      </div>
    </motion.div>
  );
}
