import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUsers, FiUserPlus, FiBarChart2, FiSettings,
  FiLogOut, FiChevronLeft, FiChevronRight, FiShield,
} from 'react-icons/fi';
import { User } from '../data/types';

interface SidebarProps {
  user: User | null;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const baseNavItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard', adminOnly: false },
  { to: '/leads', icon: FiUsers, label: 'Leads', adminOnly: false },
  { to: '/leads/add', icon: FiUserPlus, label: 'Add Lead', adminOnly: false },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics', adminOnly: false },
  { to: '/accounts', icon: FiShield, label: 'Accounts', adminOnly: true },
  { to: '/settings', icon: FiSettings, label: 'Settings', adminOnly: false },
];

function SidebarContent({ user, collapsed, onToggle, onLogout, onMobileClose }: Omit<SidebarProps, 'mobileOpen'>) {
  const navigate = useNavigate();
  const navItems = baseNavItems.filter(item => !item.adminOnly || user?.isAdmin);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-5 border-b border-slate-700/50`}>
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
          <span className="text-white font-bold text-base">C</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <div className="text-white font-bold text-base">CRM Pro</div>
              <div className="text-slate-500 text-xs">Lead Management</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : ''} ${collapsed ? 'justify-center px-3' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-slate-700/50 space-y-1">
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center px-3' : ''}`}
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-3 py-2 mt-2"
          >
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user.name[0]}</span>
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-sm font-medium truncate">{user.name}</div>
              <div className="text-slate-500 text-xs truncate">{user.role}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-dark-700 border border-slate-600/50 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-dark-600 transition-all shadow-lg"
      >
        {collapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const { collapsed, mobileOpen, onMobileClose } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block relative bg-dark-800 border-r border-slate-700/50 flex-shrink-0 h-screen sticky top-0"
      >
        <SidebarContent {...props} />
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-60 bg-dark-800 border-r border-slate-700/50 z-50"
            >
              <SidebarContent {...props} collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
