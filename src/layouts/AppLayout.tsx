import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { User } from '../data/types';

interface AppLayoutProps {
  user: User | null;
  onLogout: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/leads/add': 'Add New Lead',
  '/analytics': 'Analytics',
  '/accounts': 'Manage Accounts',
  '/settings': 'Settings',
};

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] ?? 'CRM Pro';

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      <Sidebar
        user={user}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          title={title}
          user={user}
          onMenuToggle={() => setMobileOpen(v => !v)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
