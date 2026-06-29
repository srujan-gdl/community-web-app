import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../themeContext';
import { useSession } from '../../context/SessionContext';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Bell,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/**
 * AppShell — shared sidebar + header layout wrapper for all role dashboards.
 *
 * Props:
 *   navItems:    Array<{ key: string, labelKey: string, icon: ReactNode }>
 *   activeTab:   string
 *   onTabChange: (key: string) => void
 *   title:       string  (localised page title shown in header)
 */
export default function AppShell({ navItems, activeTab, onTabChange, title, children }) {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const { currentUser, clearSession } = useSession();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const langRef = useRef(null);
  const themeRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const themeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const ThemeIcon = themeIcon;

  const initials = currentUser
    ? `${currentUser.first_name?.[0] ?? ''}${currentUser.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const displayName = currentUser
    ? `${currentUser.first_name ?? ''} ${currentUser.last_name ?? ''}`.trim()
    : '';

  return (
    <div className="flex h-screen w-full bg-app text-textPrimary overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="flex flex-col w-64 shrink-0 bg-sidebar border-r border-border h-full">

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 border-b border-border h-16 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold font-display bg-gradient-to-r from-textPrimary to-accentPrimary bg-clip-text text-transparent">
            CotoGate
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => onTabChange(item.key)}
                className={[
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left',
                  isActive
                    ? 'bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/20'
                    : 'text-textSecondary hover:bg-hoverBg hover:text-textPrimary border border-transparent',
                ].join(' ')}
              >
                <span className={isActive ? 'text-accentPrimary' : 'text-textMuted'}>
                  {item.icon}
                </span>
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Premium badge */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-accentPrimary/5 border border-accentPrimary/15">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-accentSecondary" />
            <span className="text-xs font-semibold text-textPrimary">{t('common.premium_active')}</span>
          </div>
          <p className="text-[11px] text-textMuted leading-snug">{t('common.premium_sync')}</p>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-border pt-3">
          <Button
            variant="ghost"
            id="btn-logout"
            onClick={clearSession}
            className="w-full justify-start gap-3 text-sm text-textSecondary hover:text-red-500 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-6 border-b border-border bg-app shrink-0 gap-4 h-16">
          <h1 className="text-base font-bold font-display text-textPrimary truncate">{title}</h1>

          <div className="flex items-center gap-3">

            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <Button
                id="btn-lang-toggle-shell"
                variant="ghost"
                size="sm"
                onClick={() => { setShowLangDropdown((v) => !v); setShowThemeDropdown(false); }}
                className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-textPrimary h-8 px-2.5"
              >
                <Globe size={14} />
                {language.toUpperCase()}
                <ChevronDown size={12} className={`transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </Button>
              {showLangDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-card border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {[
                    { code: 'es', labelKey: 'lang.es' },
                    { code: 'en', labelKey: 'lang.en' },
                  ].map(({ code, labelKey }) => (
                    <button
                      key={code}
                      onClick={() => { setLanguage(code); setShowLangDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-hoverBg ${language === code ? 'text-accentPrimary font-bold' : 'text-textSecondary'}`}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme dropdown */}
            <div ref={themeRef} className="relative">
              <Button
                id="btn-theme-toggle-shell"
                variant="ghost"
                size="sm"
                onClick={() => { setShowThemeDropdown((v) => !v); setShowLangDropdown(false); }}
                className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-textPrimary h-8 px-2.5"
              >
                <ThemeIcon size={14} />
                <ChevronDown size={12} className={`transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
              </Button>
              {showThemeDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-card border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {[
                    { value: 'light', labelKey: 'theme.light', Icon: Sun },
                    { value: 'dark',  labelKey: 'theme.dark',  Icon: Moon },
                    { value: 'system', labelKey: 'theme.system', Icon: Monitor },
                  ].map(({ value, labelKey, Icon }) => (
                    <button
                      key={value}
                      onClick={() => { setTheme(value); setShowThemeDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-hoverBg ${theme === value ? 'text-accentPrimary font-bold' : 'text-textSecondary'}`}
                    >
                      <Icon size={13} />
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification bell */}
            <button
              id="btn-notifications"
              className="relative p-1.5 rounded-lg text-textMuted hover:text-textPrimary hover:bg-hoverBg transition-colors"
              aria-label={t('common.notifications')}
            >
              <Bell size={18} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-app" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow">
                {initials}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-textPrimary">{displayName}</p>
                <p className="text-[10px] text-textMuted capitalize">{currentUser?.role?.replace(/_/g, ' ')}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
