import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiUser, FiUserPlus, FiLogIn, FiCheck } from 'react-icons/fi';
import { getRememberMe, setRememberMe } from '../utils/storage';
import { validateEmail } from '../utils/helpers';
import { UserRole } from '../data/types';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string;
  onClearError: () => void;
}

const ROLE_OPTIONS: UserRole[] = ['Agent', 'Manager', 'Administrator'];

export function LoginForm({ onLogin, onRegister, loading, error, onClearError }: LoginFormProps) {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');

  // Sign in state
  const [email, setEmail] = useState(getRememberMe());
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(!!getRememberMe());

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Agent');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regSuccess, setRegSuccess] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const switchTab = (t: 'signin' | 'register') => {
    setTab(t);
    setErrors({});
    setRegSuccess('');
    onClearError();
  };

  // ─── Sign In ───────────────────────────────────────────────────────────────
  const validateSignIn = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!validateEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    setRememberMe(remember ? email : '');
    await onLogin(email, password);
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const validateRegister = (): boolean => {
    const e: Record<string, string> = {};
    if (!regName.trim()) e.regName = 'Full name is required';
    else if (regName.trim().length < 2) e.regName = 'Name must be at least 2 characters';
    if (!regEmail.trim()) e.regEmail = 'Email is required';
    else if (!validateEmail(regEmail)) e.regEmail = 'Enter a valid email address';
    if (!regPassword) e.regPassword = 'Password is required';
    else if (regPassword.length < 6) e.regPassword = 'Password must be at least 6 characters';
    if (!regConfirm) e.regConfirm = 'Please confirm your password';
    else if (regPassword !== regConfirm) e.regConfirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    const result = await onRegister(regName.trim(), regEmail.trim(), regPassword, regRole);
    if (result.success) {
      setRegSuccess(result.message);
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm(''); setRegRole('Agent');
      setErrors({});
    } else {
      setErrors({ regEmail: result.message });
    }
  };

  const fieldErr = (key: string) => errors[key]
    ? <p className="text-red-400 text-xs mt-1.5 ml-1">{errors[key]}</p>
    : null;

  const inputCls = (key: string) =>
    `input-field ${errors[key] ? 'border-red-500/60 focus:border-red-500' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full max-w-md"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <span className="text-white font-bold text-xl">CRM Pro</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-800/80 border border-slate-700/50 rounded-2xl p-1 mb-8">
        {[
          { key: 'signin', icon: FiLogIn, label: 'Sign In' },
          { key: 'register', icon: FiUserPlus, label: 'Create Account' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key as 'signin' | 'register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t.key
                ? 'gradient-primary text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'signin' ? (
          /* ────────────── SIGN IN ────────────── */
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-slate-400 text-sm">Sign in to your CRM account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"
              >
                <span>⚠</span> {error}
              </motion.div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                    placeholder="admin@crm.com"
                    className={`input-field pl-11 ${errors.email ? 'border-red-500/60' : ''}`}
                  />
                </div>
                {fieldErr('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="••••••••"
                    className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-500/60' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErr('password')}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setRemember(v => !v)}
                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                      remember ? 'bg-primary border-primary' : 'border-slate-600 bg-dark-700'
                    }`}
                  >
                    {remember && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-primary text-sm hover:text-primary-light transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <><FiLoader className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  <><FiLogIn className="w-4 h-4" /> Sign In</>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-700/50 text-center">
              <p className="text-slate-500 text-xs">
                Demo: <span className="text-slate-400 font-mono">admin@crm.com</span> /{' '}
                <span className="text-slate-400 font-mono">admin123</span>
              </p>
              <p className="text-slate-500 text-xs mt-2">
                No account?{' '}
                <button onClick={() => switchTab('register')} className="text-primary hover:text-primary-light font-medium transition-colors">
                  Create one for free
                </button>
              </p>
            </div>
          </motion.div>
        ) : (
          /* ────────────── CREATE ACCOUNT ────────────── */
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
              <p className="text-slate-400 text-sm">Set up your CRM access credentials</p>
            </div>

            {regSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4 flex-shrink-0" /> {regSuccess}
                <button
                  className="ml-auto text-green-400/70 hover:text-green-300 text-xs font-medium"
                  onClick={() => switchTab('signin')}
                >
                  Sign in →
                </button>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    value={regName}
                    onChange={e => { setRegName(e.target.value); setErrors(p => ({ ...p, regName: '' })); }}
                    placeholder="Jane Smith"
                    className={`input-field pl-11 ${inputCls('regName').split(' ').slice(1).join(' ')}`}
                  />
                </div>
                {fieldErr('regName')}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    value={regEmail}
                    onChange={e => { setRegEmail(e.target.value); setErrors(p => ({ ...p, regEmail: '' })); }}
                    placeholder="you@company.com"
                    className={`input-field pl-11 ${errors.regEmail ? 'border-red-500/60' : ''}`}
                  />
                </div>
                {fieldErr('regEmail')}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="input-field text-sm appearance-none cursor-pointer"
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => { setRegPassword(e.target.value); setErrors(p => ({ ...p, regPassword: '' })); }}
                      placeholder="Min 6 chars"
                      className={`input-field pl-10 pr-9 text-sm ${errors.regPassword ? 'border-red-500/60' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showRegPass ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErr('regPassword')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      value={regConfirm}
                      onChange={e => { setRegConfirm(e.target.value); setErrors(p => ({ ...p, regConfirm: '' })); }}
                      placeholder="Repeat"
                      className={`input-field pl-10 text-sm ${errors.regConfirm ? 'border-red-500/60' : ''}`}
                    />
                  </div>
                  {fieldErr('regConfirm')}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <><FiLoader className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  <><FiUserPlus className="w-4 h-4" /> Create Account</>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-700/50 text-center">
              <p className="text-slate-500 text-xs">
                Already have an account?{' '}
                <button onClick={() => switchTab('signin')} className="text-primary hover:text-primary-light font-medium transition-colors">
                  Sign in instead
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
