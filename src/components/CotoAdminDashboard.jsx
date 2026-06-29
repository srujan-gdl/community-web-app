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
  Home,
  Users,
  ShieldCheck,
  PlusCircle,
  Link2,
} from 'lucide-react';
import { createUnit, onboardResident, linkUserToUnit } from '../lib/api';
import { validateForm, validateRequired, validateEmail, validatePhone, validatePositiveNumber } from '../lib/validators';

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED_UNITS = [
  { id: 'unit-1', block: 'A', house: '101', balance: 0,    occupied: true  },
  { id: 'unit-2', block: 'A', house: '102', balance: 4800, occupied: true  },
  { id: 'unit-3', block: 'A', house: '103', balance: 0,    occupied: false },
  { id: 'unit-4', block: 'B', house: '201', balance: 9600, occupied: true  },
  { id: 'unit-5', block: 'B', house: '202', balance: 0,    occupied: true  },
  { id: 'unit-6', block: 'B', house: '203', balance: 0,    occupied: false },
];

const SEED_RESIDENTS = [
  { id: 'res-1', name: 'María García',  email: 'maria@email.com',  unit: 'A-101', role: 'resident_owner',  status: 'active' },
  { id: 'res-2', name: 'Juan López',    email: 'juan@email.com',   unit: 'A-102', role: 'resident_owner',  status: 'active' },
  { id: 'res-3', name: 'Sofía Ruiz',    email: 'sofia@email.com',  unit: 'B-201', role: 'resident_tenant', status: 'active' },
  { id: 'res-4', name: 'Carlos Perez',  email: 'carlos@email.com', unit: 'B-202', role: 'resident_owner',  status: 'active' },
];

const SEED_GUARDS = [
  { id: 'grd-1', name: 'Guardia Robles', email: 'guard@cotogate.com', station: 'Main Gate 1', status: 'active' },
];

const EMPTY_UNIT_FORM = { house: '', block: '', balance: '0' };
const EMPTY_RESIDENT_FORM = { first_name: '', last_name: '', email: '', phone: '', unit_id: '', role: 'resident_owner', relationship: 'owner' };
const EMPTY_LINK_FORM = { email: '', unit_id: '', relationship: 'tenant', primary: false };
const EMPTY_GUARD_FORM = { first_name: '', last_name: '', email: '', station: '' };

const ROLES = ['resident_owner', 'resident_tenant'];
const RELATIONSHIPS = ['owner', 'tenant', 'family_member'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, accentColor, label, value, sub }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 border-l-4" style={{ borderLeftColor: accentColor }}>
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: accentColor }} />
        <span className="text-xs font-medium text-textMuted uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-textPrimary font-display">{value}</p>
      {sub && <p className="text-xs text-textMuted">{sub}</p>}
    </div>
  );
}

function FormField({ label, id, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-textSecondary">{label}</Label>
      {children}
    </div>
  );
}

function FieldError({ errorKey, t }) {
  if (!errorKey) return null;
  return <p className="text-xs text-red-500 mt-1">{t(errorKey)}</p>;
}

function StatusBadge({ status, t }) {
  return (
    <Badge className={status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
      {status === 'active' ? t('common.active') : t('common.inactive')}
    </Badge>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CotoAdminDashboard() {
  const { t } = useI18n();
  const { currentUser } = useSession();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [units, setUnits] = useState(SEED_UNITS);
  const [residents, setResidents] = useState(SEED_RESIDENTS);
  const [guards, setGuards] = useState(SEED_GUARDS);

  // Unit scaffold modal
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitForm, setUnitForm] = useState(EMPTY_UNIT_FORM);
  const [unitErrors, setUnitErrors] = useState({});
  const [unitLoading, setUnitLoading] = useState(false);
  const [unitSuccess, setUnitSuccess] = useState('');

  // Onboard resident modal
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [residentForm, setResidentForm] = useState(EMPTY_RESIDENT_FORM);
  const [residentErrors, setResidentErrors] = useState({});
  const [residentLoading, setResidentLoading] = useState(false);
  const [residentSuccess, setResidentSuccess] = useState('');

  // Link user to unit modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState(EMPTY_LINK_FORM);
  const [linkErrors, setLinkErrors] = useState({});
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState('');

  // Add guard modal
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [guardForm, setGuardForm] = useState(EMPTY_GUARD_FORM);
  const [guardErrors, setGuardErrors] = useState({});
  const [guardLoading, setGuardLoading] = useState(false);
  const [guardSuccess, setGuardSuccess] = useState('');

  // The community ID comes from the logged-in coto_admin's managed community
  const communityId = currentUser?.managed_community_id ?? 'comm-1';

  // ── Nav ───────────────────────────────────────────────────────────────────
  const navItems = [
    { key: 'dashboard', labelKey: 'nav.dashboard',  icon: <LayoutDashboard size={17} /> },
    { key: 'units',     labelKey: 'nav.units',       icon: <Home size={17} /> },
    { key: 'residents', labelKey: 'nav.residents',   icon: <Users size={17} /> },
    { key: 'guards',    labelKey: 'nav.guards',      icon: <ShieldCheck size={17} /> },
  ];

  // ── Unit handlers ─────────────────────────────────────────────────────────
  const handleUnitChange = (f, v) => {
    setUnitForm((prev) => ({ ...prev, [f]: v }));
    if (unitErrors[f]) setUnitErrors((e) => ({ ...e, [f]: undefined }));
  };

  const handleUnitSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm([
      { field: 'house',   value: unitForm.house,   validators: [validateRequired] },
      { field: 'block',   value: unitForm.block,   validators: [validateRequired] },
      { field: 'balance', value: unitForm.balance, validators: [validatePositiveNumber] },
    ]);
    if (!isValid) { setUnitErrors(errors); return; }
    setUnitLoading(true);
    try {
      await createUnit(communityId, unitForm).catch(() => null);
      setUnits((prev) => [...prev, { id: `unit-${Date.now()}`, ...unitForm, balance: Number(unitForm.balance), occupied: false }]);
      setUnitSuccess(t('common.success'));
      setUnitForm(EMPTY_UNIT_FORM);
      setTimeout(() => { setUnitSuccess(''); setShowUnitModal(false); }, 1500);
    } finally {
      setUnitLoading(false);
    }
  };

  // ── Resident handlers ─────────────────────────────────────────────────────
  const handleResidentChange = (f, v) => {
    setResidentForm((prev) => ({ ...prev, [f]: v }));
    if (residentErrors[f]) setResidentErrors((e) => ({ ...e, [f]: undefined }));
  };

  const handleResidentSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm([
      { field: 'first_name', value: residentForm.first_name, validators: [validateRequired] },
      { field: 'last_name',  value: residentForm.last_name,  validators: [validateRequired] },
      { field: 'email',      value: residentForm.email,      validators: [validateRequired, validateEmail] },
      { field: 'phone',      value: residentForm.phone,      validators: [validateRequired, validatePhone] },
      { field: 'unit_id',   value: residentForm.unit_id,    validators: [validateRequired] },
    ]);
    if (!isValid) { setResidentErrors(errors); return; }
    setResidentLoading(true);
    try {
      await onboardResident(residentForm).catch(() => null);
      const unit = units.find((u) => u.id === residentForm.unit_id);
      setResidents((prev) => [...prev, {
        id: `res-${Date.now()}`,
        name: `${residentForm.first_name} ${residentForm.last_name}`,
        email: residentForm.email,
        unit: unit ? `${unit.block}-${unit.house}` : residentForm.unit_id,
        role: residentForm.role,
        status: 'active',
      }]);
      setResidentSuccess(t('common.success'));
      setResidentForm(EMPTY_RESIDENT_FORM);
      setTimeout(() => { setResidentSuccess(''); setShowResidentModal(false); }, 1500);
    } finally {
      setResidentLoading(false);
    }
  };

  // ── Link handlers ─────────────────────────────────────────────────────────
  const handleLinkChange = (f, v) => {
    setLinkForm((prev) => ({ ...prev, [f]: v }));
    if (linkErrors[f]) setLinkErrors((e) => ({ ...e, [f]: undefined }));
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm([
      { field: 'email',   value: linkForm.email,   validators: [validateRequired, validateEmail] },
      { field: 'unit_id', value: linkForm.unit_id, validators: [validateRequired] },
    ]);
    if (!isValid) { setLinkErrors(errors); return; }
    setLinkLoading(true);
    try {
      const unit = units.find((u) => u.id === linkForm.unit_id);
      await linkUserToUnit(linkForm.unit_id, linkForm).catch(() => null);
      setLinkSuccess(t('common.success'));
      setLinkForm(EMPTY_LINK_FORM);
      setTimeout(() => { setLinkSuccess(''); setShowLinkModal(false); }, 1500);
    } finally {
      setLinkLoading(false);
    }
  };

  // ── Guard handlers ────────────────────────────────────────────────────────
  const handleGuardChange = (f, v) => {
    setGuardForm((prev) => ({ ...prev, [f]: v }));
    if (guardErrors[f]) setGuardErrors((e) => ({ ...e, [f]: undefined }));
  };

  const handleGuardSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm([
      { field: 'first_name', value: guardForm.first_name, validators: [validateRequired] },
      { field: 'last_name',  value: guardForm.last_name,  validators: [validateRequired] },
      { field: 'email',      value: guardForm.email,      validators: [validateRequired, validateEmail] },
      { field: 'station',    value: guardForm.station,    validators: [validateRequired] },
    ]);
    if (!isValid) { setGuardErrors(errors); return; }
    setGuardLoading(true);
    try {
      setGuards((prev) => [...prev, {
        id: `grd-${Date.now()}`,
        name: `${guardForm.first_name} ${guardForm.last_name}`,
        email: guardForm.email,
        station: guardForm.station,
        status: 'active',
      }]);
      setGuardSuccess(t('common.success'));
      setGuardForm(EMPTY_GUARD_FORM);
      setTimeout(() => { setGuardSuccess(''); setShowGuardModal(false); }, 1500);
    } finally {
      setGuardLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const occupiedCount = units.filter((u) => u.occupied).length;
  const pendingBalance = units.reduce((sum, u) => sum + (u.balance ?? 0), 0);

  return (
    <AppShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={t('coto_admin.dashboard.title')}
    >

      {/* ── Dashboard Overview ─────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Home}       accentColor="#10b981" label={t('coto_admin.stats.occupied')}         value={occupiedCount}                          sub={`/ ${units.length} ${t('common.unit')}`} />
            <StatCard icon={Users}      accentColor="#6366f1" label={t('coto_admin.stats.active_residents')} value={residents.length}                       sub={t('common.active')} />
            <StatCard icon={ShieldCheck} accentColor="#f59e0b" label={t('coto_admin.stats.pending_fees')}     value={`$${pendingBalance.toLocaleString()} MXN`} sub={t('common.pending')} />
            <StatCard icon={LayoutDashboard} accentColor="#06b6d4" label={t('coto_admin.stats.visitor_log')} value="12"                                     sub="hoy" />
          </div>

          {/* Quick residents preview */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-textPrimary mb-4">{t('coto_admin.residents.title')}</h2>
            <ResidentTable residents={residents.slice(0, 5)} t={t} />
          </div>
        </div>
      )}

      {/* ── Property Units ─────────────────────────────────────────────── */}
      {activeTab === 'units' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">{t('coto_admin.units.title')}</h2>
            <Button id="btn-scaffold-unit" size="sm" onClick={() => setShowUnitModal(true)}
              className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-9 text-xs">
              <PlusCircle size={14} />
              {t('coto_admin.units.scaffold')}
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {units.map((unit) => (
              <div key={unit.id}
                className={`rounded-xl p-4 border text-center transition-colors ${unit.occupied ? 'bg-accentPrimary/5 border-accentPrimary/20' : 'bg-card border-border'}`}>
                <p className="text-lg font-bold text-textPrimary">{unit.block}-{unit.house}</p>
                <p className={`text-xs mt-1 font-medium ${unit.occupied ? 'text-emerald-500' : 'text-textMuted'}`}>
                  {unit.occupied ? t('common.active') : t('common.inactive')}
                </p>
                {unit.balance > 0 && (
                  <p className="text-[10px] text-amber-500 mt-1">${unit.balance.toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Residents ──────────────────────────────────────────────────── */}
      {activeTab === 'residents' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">{t('coto_admin.residents.title')}</h2>
            <div className="flex gap-2">
              <Button id="btn-link-unit" size="sm" variant="outline" onClick={() => setShowLinkModal(true)}
                className="gap-1.5 border-border text-textSecondary h-9 text-xs">
                <Link2 size={13} />
                {t('coto_admin.residents.link')}
              </Button>
              <Button id="btn-onboard-resident" size="sm" onClick={() => setShowResidentModal(true)}
                className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-9 text-xs">
                <PlusCircle size={14} />
                {t('coto_admin.residents.onboard')}
              </Button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <ResidentTable residents={residents} t={t} />
          </div>
        </div>
      )}

      {/* ── Guards ─────────────────────────────────────────────────────── */}
      {activeTab === 'guards' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">{t('coto_admin.guards.title')}</h2>
            <Button id="btn-add-guard" size="sm" onClick={() => setShowGuardModal(true)}
              className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-9 text-xs">
              <PlusCircle size={14} />
              {t('coto_admin.guards.add')}
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-textMuted text-xs">{t('coto_admin.guards.name')}</TableHead>
                  <TableHead className="text-textMuted text-xs">{t('coto_admin.guards.email')}</TableHead>
                  <TableHead className="text-textMuted text-xs">{t('coto_admin.guards.station')}</TableHead>
                  <TableHead className="text-textMuted text-xs">{t('common.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guards.map((g) => (
                  <TableRow key={g.id} className="border-border hover:bg-hoverBg transition-colors">
                    <TableCell className="font-medium text-sm text-textPrimary">{g.name}</TableCell>
                    <TableCell className="text-xs text-textSecondary">{g.email}</TableCell>
                    <TableCell className="text-xs text-textSecondary">{g.station}</TableCell>
                    <TableCell><StatusBadge status={g.status} t={t} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── Unit Scaffold Modal ─────────────────────────────────────────── */}
      <FormDialog
        open={showUnitModal}
        onOpenChange={(open) => { if (!unitLoading) setShowUnitModal(open); }}
        title={t('coto_admin.units.scaffold')}
        desc={t('coto_admin.units.title')}
        onSubmit={handleUnitSubmit}
        loading={unitLoading}
        success={unitSuccess}
        onCancel={() => setShowUnitModal(false)}
        t={t}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('coto_admin.units.house')} id="unit-house">
            <Input id="unit-house" value={unitForm.house} onChange={(e) => handleUnitChange('house', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" placeholder="101" />
            <FieldError errorKey={unitErrors.house} t={t} />
          </FormField>
          <FormField label={t('coto_admin.units.block')} id="unit-block">
            <Input id="unit-block" value={unitForm.block} onChange={(e) => handleUnitChange('block', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" placeholder="A" />
            <FieldError errorKey={unitErrors.block} t={t} />
          </FormField>
        </div>
        <FormField label={t('coto_admin.units.balance')} id="unit-balance">
          <Input id="unit-balance" type="number" min="0" value={unitForm.balance}
            onChange={(e) => handleUnitChange('balance', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" />
          <FieldError errorKey={unitErrors.balance} t={t} />
        </FormField>
      </FormDialog>

      {/* ── Onboard Resident Modal ──────────────────────────────────────── */}
      <FormDialog
        open={showResidentModal}
        onOpenChange={(open) => { if (!residentLoading) setShowResidentModal(open); }}
        title={t('coto_admin.residents.onboard')}
        desc={t('coto_admin.residents.title')}
        onSubmit={handleResidentSubmit}
        loading={residentLoading}
        success={residentSuccess}
        onCancel={() => setShowResidentModal(false)}
        t={t}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('super_admin.onboard.first_name')} id="res-first-name">
            <Input id="res-first-name" value={residentForm.first_name} onChange={(e) => handleResidentChange('first_name', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" />
            <FieldError errorKey={residentErrors.first_name} t={t} />
          </FormField>
          <FormField label={t('super_admin.onboard.last_name')} id="res-last-name">
            <Input id="res-last-name" value={residentForm.last_name} onChange={(e) => handleResidentChange('last_name', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" />
            <FieldError errorKey={residentErrors.last_name} t={t} />
          </FormField>
        </div>
        <FormField label={t('coto_admin.residents.email')} id="res-email">
          <Input id="res-email" type="email" value={residentForm.email} onChange={(e) => handleResidentChange('email', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" placeholder={t('login.email_placeholder')} />
          <FieldError errorKey={residentErrors.email} t={t} />
        </FormField>
        <FormField label={t('coto_admin.residents.phone')} id="res-phone">
          <Input id="res-phone" type="tel" value={residentForm.phone} onChange={(e) => handleResidentChange('phone', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" placeholder="+52 81 0000 0000" />
          <FieldError errorKey={residentErrors.phone} t={t} />
        </FormField>
        <FormField label={t('coto_admin.residents.unit')} id="res-unit">
          <select id="res-unit" value={residentForm.unit_id} onChange={(e) => handleResidentChange('unit_id', e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary">
            <option value="">{t('coto_admin.residents.unit')}</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.block}-{u.house}</option>)}
          </select>
          <FieldError errorKey={residentErrors.unit_id} t={t} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('coto_admin.residents.role')} id="res-role">
            <select id="res-role" value={residentForm.role} onChange={(e) => handleResidentChange('role', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary">
              {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </FormField>
          <FormField label={t('coto_admin.residents.relationship')} id="res-rel">
            <select id="res-rel" value={residentForm.relationship} onChange={(e) => handleResidentChange('relationship', e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary">
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </FormField>
        </div>
      </FormDialog>

      {/* ── Link User to Unit Modal ─────────────────────────────────────── */}
      <FormDialog
        open={showLinkModal}
        onOpenChange={(open) => { if (!linkLoading) setShowLinkModal(open); }}
        title={t('coto_admin.residents.link')}
        desc={t('coto_admin.residents.title')}
        onSubmit={handleLinkSubmit}
        loading={linkLoading}
        success={linkSuccess}
        onCancel={() => setShowLinkModal(false)}
        t={t}
      >
        <FormField label={t('coto_admin.residents.email')} id="link-email">
          <Input id="link-email" type="email" value={linkForm.email} onChange={(e) => handleLinkChange('email', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" placeholder={t('login.email_placeholder')} />
          <FieldError errorKey={linkErrors.email} t={t} />
        </FormField>
        <FormField label={t('coto_admin.residents.unit')} id="link-unit">
          <select id="link-unit" value={linkForm.unit_id} onChange={(e) => handleLinkChange('unit_id', e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary">
            <option value="">{t('coto_admin.residents.unit')}</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.block}-{u.house}</option>)}
          </select>
          <FieldError errorKey={linkErrors.unit_id} t={t} />
        </FormField>
        <FormField label={t('coto_admin.residents.relationship')} id="link-rel">
          <select id="link-rel" value={linkForm.relationship} onChange={(e) => handleLinkChange('relationship', e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary">
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
          </select>
        </FormField>
      </FormDialog>

      {/* ── Add Guard Modal ─────────────────────────────────────────────── */}
      <FormDialog
        open={showGuardModal}
        onOpenChange={(open) => { if (!guardLoading) setShowGuardModal(open); }}
        title={t('coto_admin.guards.add')}
        desc={t('coto_admin.guards.title')}
        onSubmit={handleGuardSubmit}
        loading={guardLoading}
        success={guardSuccess}
        onCancel={() => setShowGuardModal(false)}
        t={t}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('super_admin.onboard.first_name')} id="guard-first-name">
            <Input id="guard-first-name" value={guardForm.first_name} onChange={(e) => handleGuardChange('first_name', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" />
            <FieldError errorKey={guardErrors.first_name} t={t} />
          </FormField>
          <FormField label={t('super_admin.onboard.last_name')} id="guard-last-name">
            <Input id="guard-last-name" value={guardForm.last_name} onChange={(e) => handleGuardChange('last_name', e.target.value)}
              className="bg-app border-border text-textPrimary h-9" />
            <FieldError errorKey={guardErrors.last_name} t={t} />
          </FormField>
        </div>
        <FormField label={t('coto_admin.guards.email')} id="guard-email">
          <Input id="guard-email" type="email" value={guardForm.email} onChange={(e) => handleGuardChange('email', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" placeholder={t('login.email_placeholder')} />
          <FieldError errorKey={guardErrors.email} t={t} />
        </FormField>
        <FormField label={t('coto_admin.guards.station')} id="guard-station">
          <Input id="guard-station" value={guardForm.station} onChange={(e) => handleGuardChange('station', e.target.value)}
            className="bg-app border-border text-textPrimary h-9" placeholder="Main Gate 1" />
          <FieldError errorKey={guardErrors.station} t={t} />
        </FormField>
      </FormDialog>

    </AppShell>
  );
}

// ── Reusable sub-components ───────────────────────────────────────────────────

function ResidentTable({ residents, t }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="text-textMuted text-xs">{t('common.name')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('common.email')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('common.unit')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('common.role')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('common.status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {residents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-textMuted text-xs py-8">{t('common.no_data')}</TableCell>
          </TableRow>
        ) : residents.map((r) => (
          <TableRow key={r.id} className="border-border hover:bg-hoverBg transition-colors">
            <TableCell className="font-medium text-sm text-textPrimary">{r.name}</TableCell>
            <TableCell className="text-xs text-textSecondary">{r.email}</TableCell>
            <TableCell><Badge variant="outline" className="text-xs border-border text-textSecondary">{r.unit}</Badge></TableCell>
            <TableCell className="text-xs text-textSecondary capitalize">{r.role?.replace(/_/g, ' ')}</TableCell>
            <TableCell><StatusBadge status={r.status} t={t} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Generic modal form wrapper that handles the layout boilerplate */
function FormDialog({ open, onOpenChange, title, desc, onSubmit, loading, success, onCancel, children, t }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-textPrimary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-textPrimary">{title}</DialogTitle>
          {desc && <DialogDescription className="text-textMuted text-xs">{desc}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          {children}
          {success && <p className="text-xs text-emerald-500 font-medium">{success}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}
              className="flex-1 border-border text-textSecondary">{t('common.cancel')}</Button>
            <Button type="submit" disabled={loading}
              className="flex-1 bg-accentPrimary text-white hover:bg-accentPrimary/90">
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
