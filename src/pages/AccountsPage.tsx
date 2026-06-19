import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiShield,
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX,
  FiToggleLeft, FiToggleRight,
} from 'react-icons/fi';
import { Account, UserRole, User } from '../data/types';
import {
  getAccounts, addAccount, updateAccount, deleteAccount,
  generateId, formatDate, emailExists,
} from '../utils/storage';
import { validateEmail } from '../utils/helpers';

interface AccountsPageProps {
  currentUser: User | null;
}

const ROLE_OPTIONS: UserRole[] = ['Agent', 'Manager', 'Administrator'];

const ROLE_COLORS: Record<UserRole, string> = {
  Administrator: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  Manager: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Agent: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

const emptyForm = { name: '', email: '', password: '', role: 'Agent' as UserRole, isAdmin: false };

export function AccountsPage({ currentUser }: AccountsPageProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { setAccounts(getAccounts()); }, []);

  const refresh = () => setAccounts(getAccounts());

  const set = (key: string, value: string | boolean) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email';
    else if (!editAccount && emailExists(form.email)) e.email = 'Email already registered';
    if (!editAccount && !form.password) e.password = 'Password is required';
    else if (!editAccount && form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editAccount) {
      const updated: Account = {
        ...editAccount,
        name: form.name.trim(),
        role: form.role,
        isAdmin: form.role === 'Administrator',
        isActive: editAccount.isActive,
      };
      updateAccount(updated);
      flash('Account updated successfully.');
    } else {
      const account: Account = {
        id: generateId(),
        email: form.email.trim(),
        passwordHash: btoa(form.password),
        name: form.name.trim(),
        role: form.role,
        isAdmin: form.role === 'Administrator',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addAccount(account);
      flash('Account created successfully.');
    }

    refresh();
    setShowForm(false);
    setEditAccount(null);
    setForm(emptyForm);
  };

  const handleEdit = (acc: Account) => {
    setEditAccount(acc);
    setForm({ name: acc.name, email: acc.email, password: '', role: acc.role, isAdmin: acc.isAdmin });
    setErrors({});
    setShowForm(true);
  };

  const handleToggleActive = (acc: Account) => {
    if (acc.id === currentUser?.id) return;
    updateAccount({ ...acc, isActive: !acc.isActive });
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) { deleteAccount(deleteId); setDeleteId(null); refresh(); }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditAccount(null);
    setForm(emptyForm);
    setErrors({});
  };

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const isCurrentUser = (acc: Account) => acc.id === currentUser?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Accounts</h2>
          <p className="text-slate-400 text-sm mt-0.5">{accounts.length} registered {accounts.length === 1 ? 'account' : 'accounts'}</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(v => !v); }}
          className="btn-primary py-2.5 text-sm shadow-lg shadow-blue-500/20"
        >
          <FiUserPlus className="w-4 h-4" />
          New Account
        </button>
      </motion.div>

      {/* Success banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <FiCheck className="w-4 h-4" /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Form panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full xl:w-96 flex-shrink-0"
            >
              <div className="glass rounded-2xl p-6">
                {/* Form header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold">{editAccount ? 'Edit Account' : 'Create Account'}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{editAccount ? 'Update account details' : 'Add a new CRM user'}</p>
                  </div>
                  <button onClick={handleCancel} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="Jane Smith"
                        className={`input-field pl-10 py-2.5 text-sm ${errors.name ? 'border-red-500/60' : ''}`}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        type="text"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="jane@company.com"
                        readOnly={!!editAccount}
                        className={`input-field pl-10 py-2.5 text-sm ${errors.email ? 'border-red-500/60' : ''} ${editAccount ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                    {editAccount && <p className="text-slate-600 text-xs mt-1 ml-1">Email cannot be changed after creation</p>}
                  </div>

                  {/* Password (create only) */}
                  {!editAccount && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Password *</label>
                      <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={form.password}
                          onChange={e => set('password', e.target.value)}
                          placeholder="Min 6 characters"
                          className={`input-field pl-10 pr-10 py-2.5 text-sm ${errors.password ? 'border-red-500/60' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>
                  )}

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                    <select
                      value={form.role}
                      onChange={e => set('role', e.target.value)}
                      className="input-field py-2.5 text-sm appearance-none cursor-pointer"
                    >
                      {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Role description */}
                  <div className="glass-light rounded-xl px-4 py-3 text-xs text-slate-400 leading-relaxed">
                    {form.role === 'Administrator' && '⚡ Full access — can manage accounts, leads, and all settings.'}
                    {form.role === 'Manager' && '📊 Can view all leads, run reports, and manage team assignments.'}
                    {form.role === 'Agent' && '👤 Can add and manage their own leads and contacts.'}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="submit" className="btn-primary flex-1 py-2.5 text-sm shadow-md shadow-blue-500/20">
                      {editAccount ? 'Update Account' : 'Create Account'}
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-ghost py-2.5 text-sm px-5">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accounts list */}
        <div className="flex-1 min-w-0">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-slate-400" />
              <span className="text-white font-semibold text-sm">All Accounts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">User</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Created</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((acc, i) => (
                      <motion.tr
                        key={acc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-slate-700/20 hover:bg-slate-700/15 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white ${acc.isAdmin ? 'gradient-primary shadow-sm shadow-blue-500/20' : 'bg-slate-600/60'}`}>
                              {acc.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-white text-sm font-medium">{acc.name}</span>
                                {acc.isAdmin && <FiShield className="w-3 h-3 text-primary" title="Admin" />}
                                {isCurrentUser(acc) && (
                                  <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-medium">You</span>
                                )}
                              </div>
                              <div className="text-slate-500 text-xs">{acc.email}</div>
                              <div className="md:hidden mt-0.5">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[acc.role]}`}>{acc.role}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[acc.role]}`}>
                            {acc.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-slate-500 text-xs">{formatDate(acc.createdAt)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleActive(acc)}
                            disabled={isCurrentUser(acc)}
                            title={isCurrentUser(acc) ? 'Cannot deactivate yourself' : acc.isActive ? 'Deactivate' : 'Activate'}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
                              isCurrentUser(acc)
                                ? 'cursor-not-allowed opacity-50'
                                : 'hover:opacity-80 cursor-pointer'
                            } ${acc.isActive ? 'text-green-400' : 'text-slate-500'}`}
                          >
                            {acc.isActive
                              ? <><FiToggleRight className="w-4 h-4" /> Active</>
                              : <><FiToggleLeft className="w-4 h-4" /> Inactive</>
                            }
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(acc)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => !isCurrentUser(acc) && setDeleteId(acc.id)}
                              disabled={isCurrentUser(acc)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                isCurrentUser(acc)
                                  ? 'text-slate-700 cursor-not-allowed'
                                  : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                              }`}
                              title={isCurrentUser(acc) ? 'Cannot delete yourself' : 'Delete'}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
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
              <h3 className="text-white font-semibold text-lg mb-2">Delete Account</h3>
              <p className="text-slate-400 text-sm mb-6">This account will be permanently removed and the user will lose all access.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                <button onClick={handleDelete} className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm">
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
