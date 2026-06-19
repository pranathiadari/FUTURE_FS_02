import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiShield, FiMoon, FiGlobe, FiCheck } from 'react-icons/fi';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      icon: FiUser,
      title: 'Profile',
      desc: 'Manage your account details',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <input defaultValue="Admin User" className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input defaultValue="admin@crm.com" className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
              <input defaultValue="Administrator" className="input-field py-2.5 text-sm" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
              <input defaultValue="CRM Pro Inc." className="input-field py-2.5 text-sm" />
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: FiBell,
      title: 'Notifications',
      desc: 'Configure alert preferences',
      content: (
        <div className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive lead updates via email' },
            { key: 'push' as const, label: 'Push Notifications', desc: 'Browser push notifications' },
            { key: 'weekly' as const, label: 'Weekly Report', desc: 'Summary email every Monday' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between glass-light rounded-xl px-4 py-3.5">
              <div>
                <div className="text-white text-sm font-medium">{item.label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-primary' : 'bg-dark-700 border border-slate-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${notifications[item.key] ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: FiShield,
      title: 'Security',
      desc: 'Password and access settings',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Password</label>
            <input type="password" placeholder="••••••••" className="input-field py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
            <input type="password" placeholder="••••••••" className="input-field py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New Password</label>
            <input type="password" placeholder="••••••••" className="input-field py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-3 glass-light rounded-xl px-4 py-3.5">
            <FiShield className="w-4 h-4 text-green-400" />
            <div>
              <div className="text-white text-sm font-medium">Two-Factor Authentication</div>
              <div className="text-slate-500 text-xs">Currently disabled — enable for extra security</div>
            </div>
            <button className="ml-auto text-xs font-medium text-primary hover:text-primary-light transition-colors">Enable</button>
          </div>
        </div>
      ),
    },
    {
      icon: FiGlobe,
      title: 'Preferences',
      desc: 'Localization and display settings',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Timezone</label>
              <select className="input-field py-2.5 text-sm appearance-none cursor-pointer">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Format</label>
              <select className="input-field py-2.5 text-sm appearance-none cursor-pointer">
                <option>MMM DD, YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 glass-light rounded-xl px-4 py-3.5">
            <FiMoon className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-white text-sm font-medium">Dark Mode</div>
              <div className="text-slate-500 text-xs">Currently active</div>
            </div>
            <div className="ml-auto w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <FiCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account and application preferences</p>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <FiCheck className="w-4 h-4" /> Settings saved successfully!
        </motion.div>
      )}

      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center">
              <section.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{section.title}</h3>
              <p className="text-slate-500 text-xs">{section.desc}</p>
            </div>
          </div>
          {section.content}
        </motion.div>
      ))}

      <div className="flex gap-3 pb-6">
        <button onClick={handleSave} className="btn-primary py-2.5 text-sm px-8 shadow-lg shadow-blue-500/20">
          Save Changes
        </button>
        <button className="btn-ghost py-2.5 text-sm px-6">Discard</button>
      </div>
    </div>
  );
}
