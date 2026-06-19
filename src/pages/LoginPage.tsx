import { motion } from 'framer-motion';
import { LoginHero } from '../components/LoginHero';
import { LoginForm } from '../components/LoginForm';
import { PublicLeadForm } from '../components/PublicLeadForm';
import { UserRole } from '../data/types';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string;
  onClearError: () => void;
}

export function LoginPage({ onLogin, onRegister, loading, error, onClearError }: LoginPageProps) {
  return (
    <div className="min-h-screen flex bg-dark-900">

      {/* ── Col 1: Hero (desktop only) ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden xl:flex xl:w-[30%] bg-dark-800 border-r border-slate-700/40 flex-shrink-0"
      >
        <LoginHero />
      </motion.div>

      {/* ── Col 2: Public Lead Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hidden lg:flex lg:w-[38%] xl:w-[35%] flex-shrink-0 border-r border-slate-700/40 relative overflow-hidden"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/60 to-dark-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Vertical divider label */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-20">
          <div className="w-8 h-8 rounded-full bg-dark-800 border border-slate-700/60 flex items-center justify-center shadow-lg">
            <span className="text-slate-500 text-[10px] font-bold">OR</span>
          </div>
        </div>

        <div className="relative z-10 w-full px-8 py-12 flex flex-col justify-center overflow-y-auto">
          <PublicLeadForm />
        </div>
      </motion.div>

      {/* ── Col 3: Login / Register ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        {/* Mobile: show lead form above login when hero+lead column is hidden */}
        <div className="lg:hidden w-full max-w-md mb-8 relative z-10">
          <div className="mb-6 pb-6 border-b border-slate-700/50">
            <PublicLeadForm />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <LoginForm
            onLogin={onLogin}
            onRegister={onRegister}
            loading={loading}
            error={error}
            onClearError={onClearError}
          />
        </div>
      </div>

    </div>
  );
}
