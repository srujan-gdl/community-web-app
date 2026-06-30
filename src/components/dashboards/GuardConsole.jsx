import React, { useState } from 'react';
import { useI18n } from '../../context/i18nContext';
import { ShieldCheck, LogOut, CheckCircle2, AlertTriangle, KeyRound, Bell, Loader2, Camera, Car, User } from 'lucide-react';

export default function GuardConsole({ currentUser, onLogout }) {
  const { t } = useI18n();

  // Verification states
  const [passcodeInput, setPasscodeInput] = useState('');
  const [plateInput, setPlateInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // Simulated notification states
  const [notifyingUnit, setNotifyingUnit] = useState('');
  const [notifyState, setNotifyState] = useState('idle'); // idle | loading | success

  // Active visitor passcode databases
  const activePasscodes = [
    { code: '782190', visitor: 'Raul Ortiz (Visita)', unit: 'Casa 102', type: 'Guest' },
    { code: '112903', visitor: 'UberEats Exec', unit: 'Depto 302', type: 'Delivery' }
  ];

  // Live gate entry logs
  const [entryLogs, setEntryLogs] = useState([
    { id: '1', visitor: 'DHL Delivery (Express)', unit: 'Casa 115', time: '02:45 PM', plates: 'JRL-482-B', status: 'Entered' },
    { id: '2', visitor: 'Jorge Gutierrez (Plomero)', unit: 'Depto 302', time: '02:15 PM', plates: 'MXN-902-A', status: 'Entered' },
    { id: '3', visitor: 'Mariana Lopez (Guest)', unit: 'Casa 104', time: '01:30 PM', plates: 'N/A', status: 'Exited' }
  ]);

  // Code validation action
  const handleVerify = (e) => {
    e.preventDefault();
    setScanResult(null);

    const match = activePasscodes.find(p => p.code === passcodeInput);
    if (match) {
      setScanResult({
        success: true,
        message: `VALID ACCESS! Visitor: ${match.visitor} • Unit: ${match.unit} (${match.type})`
      });

      // Append to logs
      setEntryLogs(prev => [
        {
          id: Date.now().toString(),
          visitor: match.visitor,
          unit: match.unit,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plates: plateInput || 'N/A',
          status: 'Entered'
        },
        ...prev
      ]);
    } else {
      setScanResult({
        success: false,
        message: 'INVALID PASSCODE! Access denied. Check code or notify resident.'
      });
    }
  };

  // Push notifications simulation
  const handleNotifyResident = (e) => {
    e.preventDefault();
    if (!notifyingUnit) return;

    setNotifyState('loading');

    setTimeout(() => {
      setNotifyState('success');
      
      // Append to logs
      setEntryLogs(prev => [
        {
          id: Date.now().toString(),
          visitor: 'Unscheduled Delivery (Rappi)',
          unit: notifyingUnit,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          plates: 'N/A',
          status: 'Entered'
        },
        ...prev
      ]);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">
      
      {/* 1. Header Area */}
      <header className="px-6 py-4 bg-[#0f172a] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight font-title">CotoGate Caseta</span>
            <span className="text-[10px] text-[#06b6d4] uppercase font-bold tracking-widest block leading-none">Tower Console</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-300">Guard ID: {currentUser?.name || 'Guardia 01'}</p>
            <p className="text-[10px] text-[#94a3b8]">{currentUser?.agency || 'Seguridad Atlas'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-xs font-bold transition-all"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Core Dashboard Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Gate Operations Forms */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Section A: Passcode check */}
          <div className="glass-card p-6" style={{ background: 'rgba(22, 28, 45, 0.4)' }}>
            <div className="flex items-center gap-3 mb-4">
              <KeyRound size={20} className="text-[#06b6d4]" />
              <h2 className="text-lg font-bold font-title">{t('guard.verify')}</h2>
            </div>
            
            <form onSubmit={handleVerify} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-semibold text-[#94a3b8] uppercase mb-2 block">{t('guard.input_placeholder')}</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 782190"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full bg-[#0f172a] border border-white/5 focus:border-indigo-500 text-white rounded-lg p-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#94a3b8] uppercase mb-2 block">{t('guard.plate')}</label>
                <div className="relative flex items-center">
                  <Car size={16} className="absolute left-3 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="e.g. JRL-123-A"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/5 focus:border-indigo-500 text-white rounded-lg py-3 pl-10 pr-3 text-sm outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-indigo-500/10"
              >
                <span>Verify Access</span>
              </button>
            </form>

            {/* Validation Feedback message */}
            {scanResult && (
              <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${scanResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                {scanResult.success ? <CheckCircle2 size={20} className="shrink-0 text-emerald-400" /> : <AlertTriangle size={20} className="shrink-0 text-red-400" />}
                <span className="text-sm font-semibold">{scanResult.message}</span>
              </div>
            )}
          </div>

          {/* Section B: Unscheduled visitors resident push trigger */}
          <div className="glass-card p-6" style={{ background: 'rgba(22, 28, 45, 0.4)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Bell size={20} className="text-indigo-400" />
              <h2 className="text-lg font-bold font-title">Unscheduled Visitor Push Alerts</h2>
            </div>
            <p className="text-[#94a3b8] text-xs mb-6">If visitor has no code, enter the target house number to trigger an instant resident mobile app verification request.</p>

            <form onSubmit={handleNotifyResident} className="flex gap-4 items-end max-w-md">
              <div className="flex-1">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase mb-2 block">Target Unit / House</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Casa 102 or Depto 302"
                  value={notifyingUnit}
                  onChange={(e) => setNotifyingUnit(e.target.value)}
                  className="w-full bg-[#0f172a] border border-white/5 focus:border-indigo-500 text-white rounded-lg p-3 text-sm outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={notifyState === 'loading'}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {notifyState === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Notifying...</span>
                  </>
                ) : (
                  <span>Send App Verification</span>
                )}
              </button>
            </form>

            {/* Simulated app response feedback */}
            {notifyState === 'loading' && (
              <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-white/5 text-slate-300 flex items-center gap-3 animate-fade-in">
                <Loader2 size={18} className="animate-spin text-[#06b6d4]" />
                <span className="text-xs">Waiting for resident in-app approval (60s countdown)...</span>
              </div>
            )}

            {notifyState === 'success' && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-xs font-bold">APPROVED! Resident Carlos Ramos (Casa 102) accepted entry. Open gate.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Live Logs Feed */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-6 flex-1 flex flex-col" style={{ background: 'rgba(22, 28, 45, 0.4)' }}>
            <h3 className="text-base font-bold font-title mb-1">{t('guard.logs')}</h3>
            <p className="text-[11px] text-slate-500 mb-6">{t('guard.recent')}</p>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[460px]">
              {entryLogs.map(log => (
                <div key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                      {log.visitor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{log.visitor}</p>
                      <p className="text-[10px] text-slate-500">Plates: {log.plates} • Time: {log.time}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#06b6d4]">{log.unit}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase mt-1 inline-block">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
