import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import GuardConsole from './components/GuardConsole';
import { I18nProvider, useI18n } from './i18n/i18nContext';
import { ThemeProvider, useTheme } from './themeContext';
import { 
  Building2, 
  CreditCard, 
  KeyRound, 
  Users, 
  Bell, 
  ShieldCheck, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet,
  Zap,
  Search,
  Settings,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
  LogOut,
  Globe
} from 'lucide-react';

function InnerApp() {
  const { t, language, setLanguage } = useI18n();

  // Navigation Routing states: landing | login | admin_dashboard | guard_dashboard
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  // Administrative Dashboard states
  const [selectedCoto, setSelectedCoto] = useState('Residencial Las Palmas');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [suspendedActionMessage, setSuspendedActionMessage] = useState('');

  // Sample client cotos managed by this external agency
  const cotos = ['Residencial Las Palmas', 'Valle Imperial', 'Aura Altitude'];

  // Mock recent payments database matching mockup
  const [payments, setPayments] = useState([
    { id: '1', name: 'Maria Garcia', unit: '12A', date: 'Today 11:34 AM', amount: 4800, method: 'SPEI', status: 'Success' },
    { id: '2', name: 'Juan Lopez', unit: '05C', date: 'Today 10:15 AM', amount: 4800, method: 'SPEI', status: 'Success' },
    { id: '3', name: 'Sofia Ruiz', unit: '198', date: 'Today 10:15 AM', amount: 4800, method: 'SPEI', status: 'Success' },
    { id: '4', name: 'Sofia Ruiz', unit: '198', date: 'Yesterday', amount: 4800, method: 'SPEI', status: 'Pending' },
    { id: '5', name: 'Maria Garcia', unit: '12A', date: 'Yesterday', amount: 4800, method: 'SPEI', status: 'Pending' },
    { id: '6', name: 'Juan Lopez', unit: '05C', date: 'Yesterday', amount: 4800, method: 'SPEI', status: 'Success' },
    { id: '7', name: 'Maria Garcia', unit: '12A', date: 'Yesterday', amount: 4800, method: 'SPEI', status: 'Success' },
    { id: '8', name: 'Sofia Ruiz', unit: '198', date: 'Yesterday', amount: 4800, method: 'SPEI', status: 'Success' }
  ]);

  // Mock visitor entries matching mockup
  const [visitorLogs, setVisitorLogs] = useState([
    { id: '1', name: 'Maria Garcia', gate: 'Main Gate 1', vehicle: 'Vehicle Info', status: 'Access Granted', type: 'Guest' },
    { id: '2', name: 'Juan Lopez', gate: 'Main Gate 1', vehicle: 'Vehicle Info', status: 'Access Granted', type: 'Delivery' },
    { id: '3', name: 'Juan Lopez', gate: 'Main Gate 1', vehicle: 'Delivery', status: 'Access Granted', type: 'Delivery' },
    { id: '4', name: 'Sofia Ruiz', gate: 'Main Gate 1', vehicle: 'Vehicle Info', status: 'Access Granted', type: 'Guest' },
    { id: '5', name: 'Maria Garcia', gate: 'South Gate', vehicle: 'South Gate', status: 'Access Granted', type: 'Guest' },
    { id: '6', name: 'Sofia Ruiz', gate: 'Access Granted', vehicle: 'Ukbt', status: 'Access Granted', type: 'Service' },
    { id: '7', name: 'Juan Lopez', gate: 'Main Gate 1', vehicle: 'Vehicle Info', status: 'Access Granted', type: 'Guest' },
    { id: '8', name: 'Maria Garcia', gate: 'Access Granted', vehicle: 'Ukbt', status: 'Pending', type: 'Guest' }
  ]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'agency_admin') {
      setCurrentView('admin_dashboard');
    } else if (user.role === 'guard') {
      setCurrentView('guard_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveTab('dashboard');
  };

  // Trigger automated card deactivations simulation
  const triggerAutomatedSuspend = () => {
    setSuspendedActionMessage(
      language === 'es' 
        ? 'Conciliando cuentas SPEI... Analizadas 8 propiedades. Suspendidas 2 tarjetas RFID de cuentas pendientes por saldo de mantenimiento vencido.' 
        : 'Reconciling SPEI accounts... Checked 8 properties. Suspended 2 RFID cards from Pending accounts due to maintenance balance overdue.'
    );
    setTimeout(() => {
      setSuspendedActionMessage('');
    }, 6000);
  };

  // View Router
  switch (currentView) {
    case 'landing':
      return <LandingPage onNavigateToLogin={() => setCurrentView('login')} />;
      
    case 'login':
      return <Login onLoginSuccess={handleLoginSuccess} onBackToHome={() => setCurrentView('landing')} />;
      
    case 'guard_dashboard':
      return <GuardConsole currentUser={currentUser} onLogout={handleLogout} />;
      
    case 'admin_dashboard':
      return (
        <div className="dashboard-layout" style={{ minHeight: '100vh', background: '#0b0f19' }}>
          
          {/* Left Navigation Sidebar */}
          <aside className="sidebar" style={{ width: '260px', background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px', position: 'sticky', top: 0, height: '100vh' }}>
            
            {/* Brand header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #fff 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CotoGate
              </span>
            </div>

            {/* Menu links matching modern sidebar */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <button onClick={() => setActiveTab('dashboard')} className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <Activity size={18} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('residents')} className={`menu-item ${activeTab === 'residents' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <Users size={18} />
                <span>Residents</span>
              </button>
              <button onClick={() => setActiveTab('visitors')} className={`menu-item ${activeTab === 'visitors' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <ShieldCheck size={18} />
                <span>Visitors</span>
              </button>
              <button onClick={() => setActiveTab('payments')} className={`menu-item ${activeTab === 'payments' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <CreditCard size={18} />
                <span>Payments</span>
              </button>
              <button onClick={() => setActiveTab('access')} className={`menu-item ${activeTab === 'access' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <KeyRound size={18} />
                <span>Access</span>
              </button>
              <button onClick={() => setActiveTab('staff')} className={`menu-item ${activeTab === 'staff' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <Building2 size={18} />
                <span>Staff</span>
              </button>
              <button onClick={() => setActiveTab('amenities')} className={`menu-item ${activeTab === 'amenities' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <FileSpreadsheet size={18} />
                <span>Amenities</span>
              </button>
              
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

              <button onClick={() => setActiveTab('settings')} className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button onClick={() => setActiveTab('support')} className={`menu-item ${activeTab === 'support' ? 'active' : ''}`} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                <HelpCircle size={18} />
                <span>Support</span>
              </button>
            </nav>

            {/* Floating upgrade banner */}
            <div className="glass-card" style={{ padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-secondary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Premium Active</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.2' }}>Gatehouse hardware is currently fully synchronized.</p>
            </div>
          </aside>

          {/* Main Content Workspace */}
          <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
            
            {/* Top Navbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              
              {/* Dashboard Title & Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h1 style={{ fontSize: '1.4rem', fontFamily: 'Outfit', fontWeight: 700 }}>{t('dashboard.title')}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{t('dashboard.active_coto')}:</span>
                  <select 
                    value={selectedCoto} 
                    onChange={(e) => setSelectedCoto(e.target.value)} 
                    className="coto-selector"
                    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    {cotos.map(coto => <option key={coto} value={coto}>{coto}</option>)}
                  </select>
                </div>
              </div>

              {/* Right Header items: Search, lang switcher, alerts, profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                {/* i18n Quick Language switcher in dashboard header */}
                <div className="flex items-center bg-slate-800/60 border border-white/5 rounded-lg p-1 gap-1">
                  <button 
                    onClick={() => setLanguage('es')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === 'es' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    ES
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    EN
                  </button>
                </div>

                {/* Search input bar */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
                  <input 
                    type="text" 
                    placeholder="Search properties, tags, payments..." 
                    style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '8px', padding: '8px 12px 8px 36px', fontSize: '0.85rem', width: '220px', outline: 'none' }}
                  />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Bell size={20} color="#94a3b8" />
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                </div>

                {/* User Profile Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {currentUser?.name.charAt(0) || 'A'}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser?.name || 'Alex R.'}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Community Manager</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Notification warnings */}
            {suspendedActionMessage !== '' && (
              <div className="glass-card animate-fade-in" style={{ padding: '14px 20px', background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Bell size={18} color="var(--status-error)" />
                <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>{suspendedActionMessage}</span>
              </div>
            )}

            {/* 3. Main Dashboard Stats cards (Shadcn grid layout) */}
            {activeTab === 'dashboard' && (
              <>
                <section className="metrics-grid" style={{ marginBottom: '28px' }}>
                  
                  {/* Card 1: Active Resident tags */}
                  <div className="glass-card metric-card" style={{ borderLeft: '3px solid #10b981' }}>
                    <span className="metric-title">{t('dashboard.metric.tags')}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                      <span className="metric-value">1,482</span>
                      <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>+2.1%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dashboard.metric.sync')}</p>
                  </div>

                  {/* Card 2: Revenue */}
                  <div className="glass-card metric-card" style={{ borderLeft: '3px solid #06b6d4' }}>
                    <span className="metric-title">{t('dashboard.metric.rev')}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                      <span className="metric-value">$248,650 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>MXN</span></span>
                      <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>+5.8%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collected via Stripe & SPEI</p>
                  </div>

                  {/* Card 3: Pending Bills */}
                  <div className="glass-card metric-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                    <span className="metric-title">{t('dashboard.metric.bills')}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                      <span className="metric-value">31</span>
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>{language === 'es' ? 'Casas' : 'Homes'}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject to tag suspend rule</p>
                  </div>

                  {/* Card 4: Visitors */}
                  <div className="glass-card metric-card" style={{ borderLeft: '3px solid #6366f1' }}>
                    <span className="metric-title">{t('dashboard.metric.visitors')}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                      <span className="metric-value">45</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>On-Site</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-logs active at main gates</p>
                  </div>

                </section>

                {/* 4. Two-column split layout (Compatible from small laptops to large screens) */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
                  
                  {/* Left Column: Recent Maintenance Payments Table */}
                  <section className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: 600 }}>{language === 'es' ? 'Pagos de Mantenimiento Recientes (SPEI)' : 'Recent Maintenance Payments (SPEI)'}</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Automated bank-reconciled statements.</p>
                      </div>
                      <button onClick={triggerAutomatedSuspend} className="premium-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        <Zap size={14} />
                        <span>{language === 'es' ? 'Sincronizar' : 'Sync Rules'}</span>
                      </button>
                    </div>

                    <div className="table-container">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Resident Name</th>
                            <th>Unit</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map(p => (
                            <tr key={p.id}>
                              <td style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                  {p.name.charAt(0)}
                                </div>
                                {p.name}
                              </td>
                              <td>{p.unit}</td>
                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.date}</td>
                              <td style={{ fontWeight: 600 }}>${p.amount.toLocaleString('en-US')}</td>
                              <td><code style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>{p.method}</code></td>
                              <td>
                                <span className={`badge ${p.status === 'Success' ? 'badge-success' : 'badge-warning'}`}>
                                  {p.status === 'Success' ? 'Success' : 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Right Column: Live Visitor Access Logs */}
                  <section className="glass-card" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: 600, marginBottom: '4px' }}>Visitor Access Log</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Active vehicle and guest entries.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
                      {visitorLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyindex: 'space-between', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: 'bold', fontSize: '0.75rem' }}>
                              {log.name.charAt(0)}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.name}</p>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.vehicle}</p>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.7rem', color: log.status === 'Pending' ? 'var(--status-warning)' : 'var(--status-success)', fontWeight: 600 }}>
                              {log.status === 'Pending' ? 'Pending' : 'Access Granted'}
                            </p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.gate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>
              </>
            )}

            {/* Tab boilerplates for additional sub-routes */}
            {activeTab !== 'dashboard' && (
              <section className="glass-card animate-fade-in" style={{ padding: '32px', textAlign: 'center' }}>
                <Building2 size={48} color="#6366f1" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                  This module manages live configurations of {activeTab} linked to the community databases.
                </p>
                <button className="premium-btn" onClick={() => setActiveTab('dashboard')}>
                  Return to General Dashboard
                </button>
              </section>
            )}

          </main>
        </div>
      );
      
    default:
      return <LandingPage onNavigateToLogin={() => setCurrentView('login')} />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <InnerApp />
      </I18nProvider>
    </ThemeProvider>
  );
}
