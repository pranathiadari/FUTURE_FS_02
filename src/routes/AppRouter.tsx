import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useLeads } from '../hooks/useApp';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AccountsPage } from '../pages/AccountsPage';
import { ProtectedRoute, PublicRoute } from './Guards';

export function AppRouter() {
  const { user, loading, error, setError, login, register, logout, isLoggedIn } = useAuth();
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={login}
                onRegister={register}
                loading={loading}
                error={error}
                onClearError={() => setError('')}
              />
            }
          />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout user={user} onLogout={logout} />}>
            <Route path="/dashboard" element={<DashboardPage leads={leads} />} />
            <Route path="/leads" element={<LeadsPage leads={leads} onAdd={addLead} onUpdate={updateLead} onDelete={deleteLead} />} />
            <Route path="/leads/add" element={<LeadsPage leads={leads} onAdd={addLead} onUpdate={updateLead} onDelete={deleteLead} showAddForm />} />
            <Route path="/analytics" element={<AnalyticsPage leads={leads} />} />
            <Route path="/accounts" element={<AccountsPage currentUser={user} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
