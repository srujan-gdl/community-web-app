import React, { useState } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Loader2, Home } from 'lucide-react';

export default function Login({ onLoginSuccess, onBackToHome }) {
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(t('login.error.empty'));
      return;
    }

    setIsLoading(true);

    // Simulate database lookup network delay
    setTimeout(() => {
      if (email === 'admin@cotogate.com' && password === 'admin123') {
        onLoginSuccess({
          id: 'adm-001',
          name: 'Alex R.',
          email: 'admin@cotogate.com',
          role: 'agency_admin',
          agency: 'Administraciones GDL S.A.'
        });
      } else if (email === 'guard@cotogate.com' && password === 'guard123') {
        onLoginSuccess({
          id: 'grd-001',
          name: 'Guardia Robles',
          email: 'guard@cotogate.com',
          role: 'guard',
          agency: 'Atlas Seguridad S.A.'
        });
      } else {
        setErrorMsg(t('login.error.invalid'));
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 relative overflow-hidden font-sans">
      
      {/* Background neon ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

      {/* Main glass login card container */}
      <div className="w-full max-w-md p-8 glass-card animate-fade-in relative z-10" style={{ background: 'rgba(22, 28, 45, 0.65)' }}>
        
        {/* Back to Home Button */}
        <button 
          onClick={onBackToHome}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
        >
          <Home size={14} />
          <span>{t('login.back')}</span>
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-bounce-subtle">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold font-title tracking-tight text-white text-center">
            {t('login.title')}
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1 text-center font-medium">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Dynamic validation error alerts */}
        {errorMsg !== '' && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 animate-fade-in">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span className="text-sm text-red-300 font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Credentials guide helper badge */}
        <div className="mb-6 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-[#94a3b8]">
          <p className="font-semibold text-indigo-300 mb-1">🔑 Demo Accounts Available:</p>
          <p>Admin: <code className="text-white bg-slate-800 px-1 py-0.5 rounded">admin@cotogate.com</code> / <code className="text-white bg-slate-800 px-1 py-0.5 rounded">admin123</code></p>
          <p className="mt-1">Guard: <code className="text-white bg-slate-800 px-1 py-0.5 rounded">guard@cotogate.com</code> / <code className="text-white bg-slate-800 px-1 py-0.5 rounded">guard123</code></p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email input field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              {t('login.email')}
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-[#64748b]" />
              <input 
                type="email"
                required
                disabled={isLoading}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-indigo-500 text-white rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('login.password')}
              </label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                {t('login.forgot')}
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-4 text-[#64748b]" />
              <input 
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-indigo-500 text-white rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Glowing submit button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transform active:scale-95 transition-all duration-300 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-white" />
                <span>{t('login.validating')}</span>
              </>
            ) : (
              <>
                <span>{t('login.submit')}</span>
                <ArrowRight size={18} className="text-white" />
              </>
            )}
          </button>

        </form>

        {/* Footer legal disclaimer */}
        <p className="mt-8 text-center text-[10px] text-[#64748b] leading-relaxed">
          CotoGate Security & Administration SaaS Mexico.<br />
          Todos los accesos son monitoreados y auditados de acuerdo a la Ley de Protección de Datos Personales.
        </p>

      </div>
    </div>
  );
}
