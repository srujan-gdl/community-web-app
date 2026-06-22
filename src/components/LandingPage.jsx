import React, { useState } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  Layers, 
  Eye, 
  Globe, 
  ChevronDown, 
  Check, 
  Tv, 
  CheckCircle2, 
  FileSpreadsheet, 
  Lock,
  Sparkles,
  Play,
  CreditCard
} from 'lucide-react';

export default function LandingPage({ onNavigateToLogin }) {
  const { t, language, setLanguage } = useI18n();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans selection:bg-[#dae2fd] selection:text-[#131b2e] antialiased">
      
      {/* 1. Header Navigation */}
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between border-b border-[#e6e8ea] bg-white relative z-50">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-[#000000] flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight font-title text-[#191c1e]">
            CotoGate
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#45464d]">
          <a href="#features" className="hover:text-black transition-colors">{t('header.features')}</a>
          <a href="#solutions" className="hover:text-black transition-colors">{t('header.solutions')}</a>
          <a href="#pricing" className="hover:text-black transition-colors text-[#0058be] font-bold underline decoration-2 underline-offset-4">{t('header.pricing')}</a>
          <a href="#about" className="hover:text-black transition-colors">{t('header.about')}</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 relative">
          
          {/* Custom Language Dropdown Switcher */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#f2f4f6] hover:bg-[#eceef0] border border-[#e0e3e5] rounded-[4px] px-3 py-1.5 text-xs font-semibold text-[#191c1e] transition-colors"
            >
              <Globe size={13} className="text-[#45464d]" />
              <span>{language.toUpperCase()}</span>
              <ChevronDown size={10} className="text-[#45464d]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-white border border-[#e0e3e5] rounded-[4px] shadow-md py-1 z-50 animate-fade-in">
                <button 
                  onClick={() => { setLanguage('es'); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#f2f4f6] text-[#191c1e]"
                >
                  Español
                </button>
                <button 
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#f2f4f6] text-[#191c1e]"
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* Login Link */}
          <button 
            onClick={onNavigateToLogin}
            className="text-xs font-semibold text-[#45464d] hover:text-black transition-colors"
          >
            {t('header.login')}
          </button>

          {/* CTA Primary */}
          <button 
            onClick={onNavigateToLogin}
            className="bg-[#000000] text-white hover:bg-neutral-800 text-xs font-bold py-2 px-4 rounded-[4px] transition-all duration-300 shadow-sm"
          >
            {t('header.try')}
          </button>

        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline details */}
        <div className="lg:col-span-7 text-left">
          
          <div className="inline-flex items-center gap-1.5 bg-[#dae2fd] border border-[#bec6e0] rounded-full px-3 py-1 mb-6">
            <span className="text-[9px] font-bold text-[#0058be] tracking-wider uppercase">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-title tracking-tight text-[#191c1e] leading-tight mb-6">
            {t('hero.title1')}<br />
            {t('hero.title2')}{' '}
            <span className="text-[#0058be]">{t('hero.title3')}</span>
          </h1>

          <p className="text-xs md:text-sm text-[#45464d] leading-relaxed max-w-xl mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToLogin}
              className="flex items-center justify-center gap-2 bg-[#0058be] text-white hover:bg-[#004bb0] text-xs font-bold py-3.5 px-6 rounded-[4px] transition-all duration-300 shadow-sm"
            >
              <span>{t('hero.cta')}</span>
              <ArrowRight size={14} />
            </button>
            
            <button 
              onClick={onNavigateToLogin}
              className="bg-white hover:bg-[#f2f4f6] border border-[#c6c6cd] text-[#191c1e] text-xs font-bold py-3.5 px-6 rounded-[4px] transition-all duration-300"
            >
              {t('hero.demo')}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Dashboard Overview Panel Mockup */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Main card */}
          <div className="bg-white border border-[#eceef0] rounded-[8px] p-6 shadow-lg w-full max-w-sm relative z-10 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-sm font-bold text-[#191c1e] leading-none mb-1">{t('hero.card.title')}</h4>
                <p className="text-[10px] text-[#45464d] leading-none">{t('hero.card.subtitle')}</p>
              </div>
              <div className="w-8 h-8 rounded bg-[#dae2fd] flex items-center justify-center text-[#0058be]">
                <Layers size={16} />
              </div>
            </div>

            {/* List entries */}
            <div className="flex flex-col gap-3 mb-6">
              
              {/* Row 1 */}
              <div className="flex items-center justify-between bg-[#f7f9fb] border border-[#eceef0] p-3 rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-none mb-1 text-[#191c1e]">{t('hero.card.item1.title')}</p>
                    <p className="text-[9px] text-[#45464d] leading-none">{t('hero.card.item1.desc')}</p>
                  </div>
                </div>
                <span className="text-[8px] font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">LIVE</span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between bg-[#f7f9fb] border border-[#eceef0] p-3 rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0058be]">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-none mb-1 text-[#191c1e]">{t('hero.card.item2.title')}</p>
                    <p className="text-[9px] text-[#45464d] leading-none">{t('hero.card.item2.desc')}</p>
                  </div>
                </div>
                <Check size={14} className="text-[#0058be]" />
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between bg-[#f7f9fb] border border-[#eceef0] p-3 rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <FileSpreadsheet size={13} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-none mb-1 text-[#191c1e]">{t('hero.card.item3.title')}</p>
                    <p className="text-[9px] text-[#45464d] leading-none">{t('hero.card.item3.desc')}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Black gate trigger button */}
            <button 
              onClick={onNavigateToLogin}
              className="w-full bg-[#000000] text-white hover:bg-neutral-800 text-xs font-bold py-3 rounded-[4px] flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>{t('hero.card.btn')}</span>
              <Zap size={12} />
            </button>

          </div>

          {/* Overlapping glowing badge in bottom-left */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-white border border-[#eceef0] rounded-[6px] p-3 flex items-center gap-3 shadow-md max-w-[150px]">
            <div className="w-7 h-7 rounded-[4px] bg-[#dae2fd] flex items-center justify-center text-[#0058be]">
              <Lock size={14} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-extrabold leading-none text-[#191c1e] mb-1">{t('hero.card.badge')}</p>
              <p className="text-[8px] text-[#45464d] leading-none">{t('hero.card.badge.desc')}</p>
            </div>
          </div>

        </div>

      </section>

      {/* 3. Core Features Bento Box Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-10 py-16 border-t border-[#e6e8ea]">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold font-title tracking-tight mb-4 text-[#191c1e]">
            {t('features.section.title')}
          </h2>
          <p className="text-xs md:text-sm text-[#45464d] max-w-xl mx-auto leading-relaxed">
            {t('features.section.subtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 2x Column width for Real-Time Tracking */}
          <div className="md:col-span-2 bg-white border border-[#eceef0] rounded-[8px] p-8 hover:shadow-md transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-7 text-left">
              <div className="w-10 h-10 rounded-[4px] bg-[#d8e2ff] flex items-center justify-center mb-6 text-[#0058be]">
                <Layers size={18} />
              </div>
              <h3 className="text-lg font-bold font-title text-[#191c1e] mb-3">{t('features.card1.title')}</h3>
              <p className="text-[#45464d] text-xs leading-relaxed mb-6">{t('features.card1.desc')}</p>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-emerald-500">{t('features.card1.bullet1')}</span>
                <span className="text-xs font-semibold text-emerald-500">{t('features.card1.bullet2')}</span>
              </div>
            </div>
            
            {/* Circular Camera overlay graphic */}
            <div className="sm:col-span-5 flex justify-center items-center">
              <div className="w-36 h-36 rounded-full border-4 border-[#dae2fd]/30 border-t-[#0058be] flex items-center justify-center relative animate-spin-[spin_3s_linear_infinite]">
                <div className="w-24 h-24 rounded-full bg-[#f7f9fb] border border-[#eceef0] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0058be]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 1x Column, solid black for SPEI Reconcile */}
          <div className="bg-[#000000] rounded-[8px] p-8 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-[4px] bg-white/10 flex items-center justify-center mb-6 text-white">
                <CreditCard size={18} />
              </div>
              <h3 className="text-lg font-bold font-title text-white mb-3">{t('features.card2.title')}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-8">{t('features.card2.desc')}</p>
            </div>

            {/* Inset gray mockup card */}
            <div className="bg-[#1e293b] rounded-[6px] p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">{t('features.card2.amount')}</span>
                <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded uppercase tracking-wider">{t('features.card2.status')}</span>
              </div>
              <span className="text-xl font-bold text-white font-title">$1,250.00 <span className="text-[10px] text-slate-400">MXN</span></span>
            </div>
          </div>

          {/* Card 3: 1x Column, light gray background for Transparent Admin */}
          <div className="bg-[#eceef0]/50 border border-[#e6e8ea] rounded-[8px] p-8 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
            <div className="w-10 h-10 rounded-[4px] bg-white flex items-center justify-center border border-[#e0e3e5] mb-6 text-[#191c1e]">
              <Eye size={18} />
            </div>
            <h3 className="text-lg font-bold font-title text-[#191c1e] mb-3">{t('features.card3.title')}</h3>
            <p className="text-[#45464d] text-xs leading-relaxed">
              {t('features.card3.desc')}
            </p>
          </div>

          {/* Card 4: 2x Column width, Royal Blue layout for Infrastructure */}
          <div className="md:col-span-2 bg-[#0058be] rounded-[8px] p-8 hover:shadow-md transition-all duration-300 text-left flex flex-col sm:flex-row justify-between gap-8 items-start sm:items-center">
            <div className="max-w-xl">
              <div className="w-10 h-10 rounded-[4px] bg-white/10 flex items-center justify-center mb-6 text-white">
                <Zap size={18} />
              </div>
              <h3 className="text-lg font-bold font-title text-white mb-3">{t('features.card4.title')}</h3>
              <p className="text-slate-200 text-xs leading-relaxed">
                {t('features.card4.desc')}
              </p>
            </div>
            <Play size={36} className="text-white/40 shrink-0 hidden sm:block" />
          </div>

        </div>
      </section>

      {/* 4. Simple Transparent Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-t border-[#e6e8ea]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left description text */}
          <div className="lg:col-span-7 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold font-title tracking-tight mb-4 text-[#191c1e]">
              {t('pricing.section.title')}
            </h2>
            <p className="text-xs md:text-sm text-[#45464d] mb-10 leading-relaxed max-w-xl">
              {t('pricing.section.subtitle')}
            </p>

            <div className="flex flex-col gap-8">
              
              {/* Bullet 1 */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e] mb-1">{t('pricing.left.bullet1.title')}</h4>
                  <p className="text-xs text-[#45464d] leading-relaxed">{t('pricing.left.bullet1.desc')}</p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e] mb-1">{t('pricing.left.bullet2.title')}</h4>
                  <p className="text-xs text-[#45464d] leading-relaxed">{t('pricing.left.bullet2.desc')}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right elevated card */}
          <div className="lg:col-span-5 flex justify-center">
            
            {/* Outline Card */}
            <div className="bg-white border-2 border-[#000000] rounded-[8px] p-8 w-full max-w-sm relative shadow-lg">
              
              {/* Top popular tag badge */}
              <span className="absolute -top-3.5 right-6 bg-[#000000] text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {t('pricing.card.badge')}
              </span>

              <h3 className="text-base font-bold font-title text-[#191c1e] text-left mb-6">{t('pricing.card.title')}</h3>
              
              <div className="flex items-baseline text-left mb-4">
                <span className="text-4xl font-extrabold font-title tracking-tight text-[#191c1e]">{t('pricing.card.price')}</span>
                <span className="text-xs text-[#45464d] ml-1">{t('pricing.card.period')}</span>
              </div>

              {/* Trial badge */}
              <div className="bg-[#dae2fd] rounded-[4px] p-2 text-left mb-6">
                <p className="text-[10px] font-bold text-[#0058be]">{t('pricing.card.trial')}</p>
              </div>

              {/* Specs */}
              <div className="flex flex-col gap-3 mb-8 text-left">
                <p className="text-xs text-[#45464d] flex items-center gap-2">{t('pricing.card.bullet1')}</p>
                <p className="text-xs text-[#45464d] flex items-center gap-2">{t('pricing.card.bullet2')}</p>
                <p className="text-xs text-[#45464d] flex items-center gap-2">{t('pricing.card.bullet3')}</p>
                <p className="text-xs text-[#45464d] flex items-center gap-2">{t('pricing.card.bullet4')}</p>
              </div>

              <button 
                onClick={onNavigateToLogin}
                className="w-full bg-[#000000] text-white hover:bg-neutral-800 text-xs font-bold py-3.5 rounded-[4px] transition-colors mb-4"
              >
                {t('pricing.card.btn')}
              </button>

              <span className="text-[9px] text-[#45464d] tracking-wider uppercase block text-center font-semibold">{t('pricing.card.footnote')}</span>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Bottom Dark CTA Section Banner */}
      <section className="bg-[#000000] text-white py-24 text-center relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold font-title tracking-tight mb-4">
            {t('cta.section.title')}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('cta.section.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button 
              onClick={onNavigateToLogin}
              className="w-full bg-white hover:bg-slate-100 text-black text-xs font-bold py-3.5 px-6 rounded-[4px] transition-colors"
            >
              {t('cta.section.btn1')}
            </button>
            <button 
              onClick={onNavigateToLogin}
              className="w-full bg-[#000000] hover:bg-neutral-900 border border-white/20 text-white text-xs font-bold py-3.5 px-6 rounded-[4px] transition-colors"
            >
              {t('cta.section.btn2')}
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer section */}
      <footer className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between text-xs text-[#45464d] bg-white border-t border-[#e6e8ea]">
        
        <div className="flex items-center gap-2.5 mb-6 md:mb-0">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center shadow-sm">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight font-title text-[#191c1e]">
            CotoGate
          </span>
        </div>

        <div className="flex gap-6 mb-6 md:mb-0 text-[#45464d]">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Security</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>

        <p className="text-[#64748b]">© 2024 CotoGate Solutions. All rights reserved.</p>

      </footer>

    </div>
  );
}
