import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/i18nContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Loader2,
  Home,
  Globe,
  Sun,
  Moon,
  Laptop,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { getPasswordStrength, loginWithApi } from '../lib/auth';

export default function Login({ onLoginSuccess, onBackToHome }) {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Dropdown refs
  const langRef = useRef(null);
  const themeRef = useRef(null);

  // Forced Password Reset states
  const [showResetModal, setShowResetModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const strengthInfo = getPasswordStrength(newPassword);
  const strength = {
    ...strengthInfo,
    text: strengthInfo.labelKey ? t(`password_reset.strength.${strengthInfo.labelKey}`) : ''
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(t('login.error.empty'));
      return;
    }

    setIsLoading(true);

    const result = await loginWithApi(email, password);
    setIsLoading(false);

    if (result.success) {
      const { user } = result;
      if (user.must_change_password) {
        setTempUser(user);
        setOldPassword(password);
        setShowResetModal(true);
      } else {
        onLoginSuccess(user);
      }
    } else {
      setErrorMsg(t(result.errorKey));
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8) {
      setResetError(t('password_reset.error.length'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError(t('password_reset.error.mismatch'));
      return;
    }

    setIsResetting(true);

    // Simulate POST /api/v1/auth/change-password endpoint call
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false);
      const updatedUser = { ...tempUser, must_change_password: false };
      onLoginSuccess(updatedUser);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-app text-textPrimary transition-all duration-300">

      {/* Utility dropdowns top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-30">

        {/* Language selector */}
        <div className="relative" ref={langRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowLangDropdown(!showLangDropdown); setShowThemeDropdown(false); }}
            className="flex items-center gap-1.5 bg-transparent border border-border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-textPrimary"
          >
            <Globe size={14} className="text-textSecondary" />
            <span>{language.toUpperCase()}</span>
          </Button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-1 w-28 bg-app border border-border rounded-lg shadow-lg py-1 z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setLanguage('es'); setShowLangDropdown(false); }}
                className={`w-full justify-start text-left px-3 py-1.5 bg-transparent ${language === 'es' ? 'text-accentPrimary font-bold' : 'text-textSecondary'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                {t('lang.es')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setLanguage('en'); setShowLangDropdown(false); }}
                className={`w-full justify-start text-left px-3 py-1.5 bg-transparent ${language === 'en' ? 'text-accentPrimary font-bold' : 'text-textSecondary'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                {t('lang.en')}
              </Button>
            </div>
          )}
        </div>

        {/* Theme switcher */}
        <div className="relative" ref={themeRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowThemeDropdown(!showThemeDropdown); setShowLangDropdown(false); }}
            className="flex items-center gap-1.5 bg-transparent border border-border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-textPrimary"
          >
            {resolvedTheme === 'dark' ? <Moon size={14} className="text-accentPrimary" /> : <Sun size={14} className="text-amber-500" />}
            <span className="capitalize">{t(`theme.${theme}`)}</span>
          </Button>

          {showThemeDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-app border border-border rounded-lg shadow-lg py-1 z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setTheme('light'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-transparent ${theme === 'light' ? 'text-accentPrimary font-bold' : 'text-textSecondary'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                <Sun size={13} />
                <span>{t('theme.light')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setTheme('dark'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-transparent ${theme === 'dark' ? 'text-accentPrimary font-bold' : 'text-textSecondary'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                <Moon size={13} />
                <span>{t('theme.dark')}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setTheme('system'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center justify-start gap-2 px-3 py-1.5 bg-transparent ${theme === 'system' ? 'text-accentPrimary font-bold' : 'text-textSecondary'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
              >
                <Laptop size={13} />
                <span>{t('theme.system')}</span>
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Left Column: CotoGate Services Illustrations & Animations */}
      <div className="w-full md:w-1/2 bg-sidebar border-b md:border-b-0 md:border-r border-border flex flex-col justify-center items-center p-8 select-none relative overflow-hidden">

        {/* Animated Background Gradients */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-cyan-500/5 dark:bg-cyan-400/5 blur-3xl" />

        {/* Core Animated SVGs Box */}
        <div className="w-full max-w-sm flex flex-col gap-8 z-10">

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accentPrimary flex items-center justify-center text-white shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <span className="text-lg font-bold font-title tracking-tight text-textPrimary">CotoGate</span>
            </div>
            <h3 className="text-xl font-bold font-title text-textPrimary mb-1">
              {t('login.left.title')}
            </h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              {t('login.left.subtitle')}
            </p>
          </div>

          {/* Service SVG 1: Passcode verifications */}
          <div className="flex items-center gap-4 bg-app border border-border p-4 rounded-xl shadow-sm hover:border-accentPrimary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" className="animate-[pulse_2s_infinite]" />
                <path d="M12 15v3" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-textPrimary">{t('login.left.visitor_title')}</h4>
              <p className="text-[10px] text-textSecondary leading-snug">{t('login.left.visitor_desc')}</p>
            </div>
          </div>

          {/* Service SVG 2: Live Socket Notifications */}
          <div className="flex items-center gap-4 bg-app border border-border p-4 rounded-xl shadow-sm hover:border-accentPrimary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
              <svg className="w-7 h-7 animate-[bounce_3s_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-textPrimary">{t('login.left.push_title')}</h4>
              <p className="text-[10px] text-textSecondary leading-snug">{t('login.left.push_desc')}</p>
            </div>
          </div>

          {/* Service SVG 3: RFID card syncing status */}
          <div className="flex items-center gap-4 bg-app border border-border p-4 rounded-xl shadow-sm hover:border-accentPrimary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
              <svg className="w-7 h-7 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-textPrimary">{t('login.left.rfid_title')}</h4>
              <p className="text-[10px] text-textSecondary leading-snug">{t('login.left.rfid_desc')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Sleek Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-sm flex flex-col gap-6">

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold font-title text-textPrimary tracking-tight">
              {t('login.title')}
            </h2>
            <p className="text-xs text-textSecondary mt-1">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Error Message alert */}
          {errorMsg !== '' && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-semibold animate-fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[11px] font-bold text-textSecondary uppercase tracking-wider">
                {t('login.email')}
              </Label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-textMuted z-10" />
                <Input
                  id="email"
                  type="email"
                  disabled={isLoading}
                  placeholder={t('login.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-[11px] font-bold text-textSecondary uppercase tracking-wider">
                  {t('login.password')}
                </Label>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-textMuted z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-textMuted hover:text-textPrimary hover:bg-transparent bg-transparent h-8 w-8"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            {/* Submit CTA */}
            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 justify-center h-10 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border-none transition-colors duration-200 shadow-md shadow-indigo-500/10 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white dark:text-black" />
                  <span>{t('login.validating')}</span>
                </>
              ) : (
                <>
                  <span>{t('login.submit')}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>

            {/* Secondary Back-to-Marketing button */}
            <Button
              type="button"
              variant="outline"
              onClick={onBackToHome}
              className="w-full justify-center h-10 bg-transparent border border-border text-textPrimary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 font-medium"
            >
              <Home size={15} />
              <span>{t('login.back_marketing')}</span>
            </Button>

          </form>

          <p className="text-center text-[10px] text-textMuted leading-relaxed border-t border-border pt-4">
            {t('login.footer.line1')}<br />
            {t('login.footer.line2')}
          </p>

        </div>
      </div>

      {/* Force Change Password Reset Modal dialog from shadcn */}
      <Dialog open={showResetModal} onOpenChange={() => { }}>
        <DialogContent showCloseButton={false} className="max-w-sm p-6 bg-app border border-border text-textPrimary shadow-premium">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <KeyRound size={20} />
              </div>
              <div className="text-left">
                <DialogTitle>{t('password_reset.title')}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">{t('password_reset.desc')}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {resetError !== '' && (
            <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">

            {/* Old password */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="oldPassword">{t('password_reset.old')}</Label>
              <Input
                id="oldPassword"
                type="password"
                disabled
                value={oldPassword}
                className="bg-slate-100 dark:bg-slate-800 opacity-60 cursor-not-allowed h-10"
              />
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="newPassword">{t('password_reset.new')}</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Password strength meter */}
            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-textSecondary">
                <span>{t('password_reset.strength')}:</span>
                <span className="capitalize">{strength.text || t('password_reset.strength.none')}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                <div className={`h-full flex-1 rounded-l-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-full flex-1 rounded-r-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="confirmPassword">{t('password_reset.confirm')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              disabled={isResetting || strength.score < 2}
              className="w-full mt-2 justify-center h-10 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 border-none transition-colors duration-200 font-semibold disabled:opacity-50 disabled:pointer-events-none"
            >
              {isResetting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white dark:text-black" />
                  <span>{t('password_reset.updating')}</span>
                </>
              ) : (
                <span>{t('password_reset.submit')}</span>
              )}
            </Button>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
