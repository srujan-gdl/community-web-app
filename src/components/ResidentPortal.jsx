import React, { useState } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useSession } from '../context/SessionContext';
import AppShell from './layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  CreditCard as CardIcon,
  XCircle,
} from 'lucide-react';

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_RFIDS = [
  { id: 'rfid-1', uid: '0x8A79B1', holder: 'Carlos Perez',   status: 'active' },
  { id: 'rfid-2', uid: '0x2C44F3', holder: 'Sofía Perez',    status: 'active' },
  { id: 'rfid-3', uid: '0xD91A7E', holder: 'Guest Fob',       status: 'suspended' },
];

const SEED_PAYMENTS = [
  { id: 'pay-1', date: '2024-06-01', amount: 4800, method: 'SPEI',  status: 'success' },
  { id: 'pay-2', date: '2024-05-01', amount: 4800, method: 'Stripe', status: 'success' },
  { id: 'pay-3', date: '2024-04-01', amount: 4800, method: 'SPEI',  status: 'success' },
  { id: 'pay-4', date: '2024-03-01', amount: 4800, method: 'SPEI',  status: 'pending' },
];

const OUTSTANDING_BALANCE = 4800; // MXN

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  if (status === 'active' || status === 'success') {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]">{t('common.active')}</Badge>;
  }
  if (status === 'suspended' || status === 'inactive') {
    return <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px]">{t('common.inactive')}</Badge>;
  }
  return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px]">{t('common.pending')}</Badge>;
}

function DeactivateConfirmDialog({ open, onOpenChange, onConfirm, t }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-textPrimary max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-textPrimary flex items-center gap-2">
            <XCircle size={18} className="text-red-500" />
            {t('resident.rfids.deactivate_confirm')}
          </DialogTitle>
          <DialogDescription className="text-textMuted text-xs leading-relaxed">
            {t('resident.rfids.deactivate_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}
            className="flex-1 border-border text-textSecondary">{t('common.cancel')}</Button>
          <Button onClick={onConfirm}
            className="flex-1 bg-red-600 text-white hover:bg-red-700">{t('common.confirm')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simulated Stripe checkout modal (real integration requires Stripe Elements SDK)
function StripeCheckoutModal({ open, onOpenChange, balance, onSuccess, t }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated Stripe authorization (replace with real Stripe.js when ready)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        setSuccess(false);
        setCardNumber(''); setExpiry(''); setCvv('');
      }, 1800);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!loading) onOpenChange(open); }}>
      <DialogContent className="bg-card border border-border text-textPrimary max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-textPrimary flex items-center gap-2">
            <CardIcon size={18} className="text-accentPrimary" />
            {t('resident.stripe.title')}
          </DialogTitle>
          <DialogDescription className="text-textMuted text-xs">{t('resident.stripe.desc')}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
            <p className="text-sm font-semibold text-textPrimary">{t('resident.stripe.success')}</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4 mt-2">
            <div className="bg-accentPrimary/5 border border-accentPrimary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-textMuted">{t('resident.balance.due')}</p>
              <p className="text-2xl font-extrabold text-textPrimary font-display">${balance.toLocaleString()} MXN</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stripe-card-number" className="text-xs font-medium text-textSecondary">
                {t('resident.stripe.card')}
              </Label>
              <Input
                id="stripe-card-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="stripe-expiry" className="text-xs font-medium text-textSecondary">MM / YY</Label>
                <Input id="stripe-expiry" placeholder="12 / 28" value={expiry}
                  onChange={(e) => setExpiry(e.target.value)} maxLength={7}
                  className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9 font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stripe-cvv" className="text-xs font-medium text-textSecondary">CVV</Label>
                <Input id="stripe-cvv" placeholder="•••" type="password" value={cvv}
                  onChange={(e) => setCvv(e.target.value)} maxLength={4}
                  className="bg-app border-border text-textPrimary h-9 font-mono" />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}
                className="flex-1 border-border text-textSecondary">{t('common.cancel')}</Button>
              <Button type="submit" disabled={loading}
                className="flex-1 bg-accentPrimary text-white hover:bg-accentPrimary/90">
                {loading ? t('common.loading') : t('resident.stripe.submit')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResidentPortal() {
  const { t } = useI18n();
  const { currentUser } = useSession();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(OUTSTANDING_BALANCE);
  const [rfids, setRfids] = useState(SEED_RFIDS);
  const [payments, setPayments] = useState(SEED_PAYMENTS);

  // Stripe modal
  const [showStripe, setShowStripe] = useState(false);

  // RFID deactivation confirm
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  // ── Nav ───────────────────────────────────────────────────────────────────
  const navItems = [
    { key: 'dashboard', labelKey: 'nav.dashboard', icon: <LayoutDashboard size={17} /> },
    { key: 'rfids',     labelKey: 'nav.rfids',     icon: <CreditCard size={17} /> },
    { key: 'payments',  labelKey: 'nav.payments',  icon: <Receipt size={17} /> },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePaymentSuccess = () => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: balance,
      method: 'Stripe',
      status: 'success',
    };
    setPayments((prev) => [newPayment, ...prev]);
    setBalance(0);
  };

  const handleDeactivate = (rfidId) => {
    setRfids((prev) =>
      prev.map((r) => r.id === rfidId ? { ...r, status: 'suspended' } : r)
    );
    setDeactivateTarget(null);
  };

  // ── Info from session ─────────────────────────────────────────────────────
  const community = currentUser?.communities?.[0];
  const unit = community?.units?.[0];
  const communityName = community?.name ?? t('resident.community');
  const unitLabel = unit ? `${t('resident.unit')} ${unit.block_number}-${unit.house_number}` : t('resident.unit');

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AppShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={t('resident.title')}
    >

      {/* ── Dashboard ──────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in max-w-2xl">
          {/* Community / Unit info */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-textMuted font-medium uppercase tracking-wide">{t('common.community')}</p>
            <p className="text-xl font-bold text-textPrimary font-display mt-1">{communityName}</p>
            <p className="text-sm text-textSecondary mt-0.5">{unitLabel}</p>
          </div>

          {/* Outstanding balance card */}
          {balance > 0 ? (
            <div className="bg-card border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                    <p className="text-sm font-semibold text-textPrimary">{t('resident.balance.due')}</p>
                  </div>
                  <p className="text-4xl font-extrabold text-textPrimary font-display">${balance.toLocaleString()} <span className="text-lg font-normal text-textMuted">MXN</span></p>
                </div>
                <Button
                  id="btn-pay-stripe"
                  onClick={() => setShowStripe(true)}
                  className="bg-accentPrimary text-white hover:bg-accentPrimary/90 shrink-0 gap-2"
                >
                  <CardIcon size={15} />
                  {t('resident.balance.pay')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-3">
              <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-500">{t('resident.balance.cleared')}</p>
            </div>
          )}

          {/* Quick RFID preview */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-textPrimary mb-4">{t('resident.rfids.title')}</h2>
            <RFIDTable rfids={rfids.slice(0, 3)} onDeactivate={setDeactivateTarget} t={t} />
          </div>
        </div>
      )}

      {/* ── RFID Cards ─────────────────────────────────────────────────── */}
      {activeTab === 'rfids' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-base font-semibold text-textPrimary">{t('resident.rfids.title')}</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <RFIDTable rfids={rfids} onDeactivate={setDeactivateTarget} t={t} />
          </div>
        </div>
      )}

      {/* ── Payments ───────────────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">{t('resident.payments.title')}</h2>
            {balance > 0 && (
              <Button id="btn-pay-stripe-payments" size="sm" onClick={() => setShowStripe(true)}
                className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-9 text-xs">
                <CardIcon size={14} />
                {t('resident.balance.pay')}
              </Button>
            )}
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-textMuted text-xs">{t('resident.payments.date')}</TableHead>
                  <TableHead className="text-textMuted text-xs">{t('resident.payments.amount')}</TableHead>
                  <TableHead className="text-textMuted text-xs">Method</TableHead>
                  <TableHead className="text-textMuted text-xs">{t('resident.payments.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="border-border hover:bg-hoverBg transition-colors">
                    <TableCell className="text-xs text-textSecondary">{p.date}</TableCell>
                    <TableCell className="font-semibold text-sm text-textPrimary">${p.amount.toLocaleString()} MXN</TableCell>
                    <TableCell><code className="text-xs bg-hoverBg px-1.5 py-0.5 rounded text-textSecondary">{p.method}</code></TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} t={t} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <StripeCheckoutModal
        open={showStripe}
        onOpenChange={setShowStripe}
        balance={balance}
        onSuccess={handlePaymentSuccess}
        t={t}
      />

      <DeactivateConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => { if (!open) setDeactivateTarget(null); }}
        onConfirm={() => handleDeactivate(deactivateTarget)}
        t={t}
      />

    </AppShell>
  );
}

// ── RFID Table sub-component ──────────────────────────────────────────────────
function RFIDTable({ rfids, onDeactivate, t }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="text-textMuted text-xs">{t('resident.rfids.uid')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('resident.rfids.holder')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('resident.rfids.status')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rfids.map((r) => (
          <TableRow key={r.id} className="border-border hover:bg-hoverBg transition-colors">
            <TableCell className="font-mono text-xs text-textSecondary">{r.uid}</TableCell>
            <TableCell className="text-sm text-textPrimary font-medium">{r.holder}</TableCell>
            <TableCell><StatusBadge status={r.status} t={t} /></TableCell>
            <TableCell>
              {r.status === 'active' && (
                <Button
                  id={`btn-deactivate-${r.id}`}
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeactivate(r.id)}
                  className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2"
                >
                  {t('resident.rfids.report_lost')}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
