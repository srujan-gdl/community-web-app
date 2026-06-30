import React from 'react';
import { I18nProvider } from './context/i18nContext';
import { ThemeProvider } from './context/ThemeContext';
import { SessionProvider, useSession } from './context/SessionContext';
import Login from './components/Login';
import GuardConsole from './components/dashboards/GuardConsole';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import CotoAdminDashboard from './components/dashboards/CotoAdminDashboard';
import ResidentPortal from './components/dashboards/ResidentPortal';

/**
 * RoleRouter — decides which screen to render based on the authenticated user's role.
 * If there is no session, it renders the Login page.
 */
function RoleRouter() {
  const { currentUser, setSession, isHydrated } = useSession();

  // Avoid rendering before sessionStorage has been read (prevents flash)
  if (!isHydrated) return null;

  // No session — show Login
  if (!currentUser) {
    const handleLoginSuccess = (user, token) => {
      // loginWithApi stores the token in sessionStorage; we mirror it to SessionContext
      const resolvedToken = token ?? sessionStorage.getItem('cotogate_token') ?? '';
      setSession(user, resolvedToken);
    };
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Session active — route by role
  switch (currentUser.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;

    case 'coto_admin':
      return <CotoAdminDashboard />;

    case 'resident_owner':
    case 'resident_tenant':
      return <ResidentPortal />;

    case 'guard':
      return <GuardConsole currentUser={currentUser} />;

    default:
      // Unknown role — clear session and fall back to login
      return <Login onLoginSuccess={(user, token) => setSession(user, token ?? sessionStorage.getItem('cotogate_token') ?? '')} />;
  }
}

/**
 * App — root provider tree. Order matters:
 *   ThemeProvider → applies .dark class to <html>
 *   I18nProvider  → provides t() and language
 *   SessionProvider → provides currentUser and JWT
 */
export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SessionProvider>
          <RoleRouter />
        </SessionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
