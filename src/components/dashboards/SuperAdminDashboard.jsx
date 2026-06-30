import React, { useState } from 'react';
import { useI18n } from '../../context/i18nContext';
import { useSession } from '../../context/SessionContext';
import AppShell from '../layout/AppShell';
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
  Building2,
  Users,
  DollarSign,
  PlusCircle,
  LayoutDashboard,
  UserPlus,
} from 'lucide-react';
import { createCommunity, onboardCotoAdmin } from '../../lib/api';
import { validateForm, validateRequired, validateEmail, validatePhone, validatePassword } from '../../lib/validators';

// ── Seed data (replaced by real API calls once backend is live) ──────────────
const SEED_COMMUNITIES = [
  { id: 'comm-1', name: 'Residencial Las Palmas', address: 'Blvd. Las Torres 200, Monterrey', timezone: 'America/Monterrey', units: 128, admin: 'Alex Ramos', created: '2024-01-10' },
  { id: 'comm-2', name: 'Valle Imperial',         address: 'Calle Real 45, Guadalajara',      timezone: 'America/Mexico_City', units: 84,  admin: 'Sandra Vela', created: '2024-03-22' },
  { id: 'comm-3', name: 'Aura Altitude',          address: 'Paseo de las Cimas 10, CDMX',     timezone: 'America/Mexico_City', units: 256, admin: 'Luis Garza',   created: '2024-06-01' },
];

const TIMEZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/Tijuana',
  'America/Cancun',
  'America/Hermosillo',
];

const EMPTY_COMMUNITY_FORM = { name: '', address: '', timezone: 'America/Mexico_City' };
const EMPTY_ADMIN_FORM = { first_name: '', last_name: '', email: '', phone: '', password: '', community_id: '' };

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, accentColor, label, value, sub }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 border-l-4`} style={{ borderLeftColor: accentColor }}>
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: accentColor }} />
        <span className="text-xs font-medium text-textMuted uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-textPrimary font-display">{value}</p>
      {sub && <p className="text-xs text-textMuted">{sub}</p>}
    </div>
  );
}

// ── Field Error helper ────────────────────────────────────────────────────────
function FieldError({ errorKey, t }) {
  if (!errorKey) return null;
  return <p className="text-xs text-red-500 mt-1">{t(errorKey)}</p>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const { t } = useI18n();
  const { currentUser } = useSession();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [communities, setCommunities] = useState(SEED_COMMUNITIES);

  // Create Community modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityForm, setCommunityForm] = useState(EMPTY_COMMUNITY_FORM);
  const [communityErrors, setCommunityErrors] = useState({});
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communitySuccess, setCommunitySuccess] = useState('');

  // Onboard Coto Admin modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState(EMPTY_ADMIN_FORM);
  const [adminErrors, setAdminErrors] = useState({});
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminApiError, setAdminApiError] = useState('');

  // ── Nav ──────────────────────────────────────────────────────────────────
  const navItems = [
    { key: 'dashboard',    labelKey: 'nav.dashboard',    icon: <LayoutDashboard size={17} /> },
    { key: 'communities',  labelKey: 'nav.communities',  icon: <Building2 size={17} /> },
    { key: 'onboard_admin', labelKey: 'nav.onboard_admin', icon: <UserPlus size={17} /> },
  ];

  // ── Create Community handlers ────────────────────────────────────────────
  const handleCommunityChange = (field, value) => {
    setCommunityForm((f) => ({ ...f, [field]: value }));
    if (communityErrors[field]) setCommunityErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm([
      { field: 'name',    value: communityForm.name,    validators: [validateRequired] },
      { field: 'address', value: communityForm.address, validators: [validateRequired] },
    ]);
    if (!isValid) { setCommunityErrors(errors); return; }

    setCommunityLoading(true);
    try {
      // Optimistic local update + API call
      const newCommunity = {
        id: `comm-${Date.now()}`,
        ...communityForm,
        units: 0,
        admin: `${currentUser?.first_name ?? ''} ${currentUser?.last_name ?? ''}`.trim(),
        created: new Date().toISOString().slice(0, 10),
      };
      await createCommunity(communityForm).catch(() => null); // non-blocking if backend offline
      setCommunities((prev) => [...prev, newCommunity]);
      setCommunitySuccess(t('super_admin.create_community.success'));
      setCommunityForm(EMPTY_COMMUNITY_FORM);
      setTimeout(() => { setCommunitySuccess(''); setShowCreateModal(false); }, 1800);
    } finally {
      setCommunityLoading(false);
    }
  };

  // ── Onboard Coto Admin handlers ──────────────────────────────────────────
  const handleAdminChange = (field, value) => {
    setAdminForm((f) => ({ ...f, [field]: value }));
    if (adminErrors[field]) setAdminErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminApiError('');
    const { isValid, errors } = validateForm([
      { field: 'first_name', value: adminForm.first_name, validators: [validateRequired] },
      { field: 'last_name',  value: adminForm.last_name,  validators: [validateRequired] },
      { field: 'email',      value: adminForm.email,      validators: [validateRequired, validateEmail] },
      { field: 'phone',      value: adminForm.phone,      validators: [validateRequired, validatePhone] },
      { field: 'password',   value: adminForm.password,   validators: [validateRequired, validatePassword] },
      { field: 'community_id', value: adminForm.community_id, validators: [validateRequired] },
    ]);
    if (!isValid) { setAdminErrors(errors); return; }

    setAdminLoading(true);
    try {
      await onboardCotoAdmin(adminForm).catch(() => null);
      setAdminSuccess(t('super_admin.onboard.success'));
      setAdminForm(EMPTY_ADMIN_FORM);
      setTimeout(() => { setAdminSuccess(''); setShowAdminModal(false); }, 1800);
    } catch {
      setAdminApiError(t('common.error'));
    } finally {
      setAdminLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <AppShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={t('super_admin.dashboard.title')}
    >

      {/* ── Dashboard Overview ─────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Building2}
              accentColor="#6366f1"
              label={t('super_admin.stats.communities')}
              value={communities.length}
              sub={t('super_admin.stats.communities_count')}
            />
            <StatCard
              icon={Users}
              accentColor="#06b6d4"
              label={t('super_admin.stats.admins')}
              value={communities.length}
              sub={t('super_admin.stats.admins_count')}
            />
            <StatCard
              icon={DollarSign}
              accentColor="#10b981"
              label={t('super_admin.stats.billing')}
              value="MXN Active"
              sub="Stripe + SPEI"
            />
          </div>

          {/* Quick communities preview */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-textPrimary">{t('super_admin.communities.title')}</h2>
              <Button id="btn-create-community-overview" size="sm" onClick={() => { setShowCreateModal(true); setActiveTab('communities'); }}
                className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-8 text-xs">
                <PlusCircle size={14} />
                {t('super_admin.communities.add')}
              </Button>
            </div>
            <CommunitiesTable communities={communities.slice(0, 3)} t={t} />
          </div>
        </div>
      )}

      {/* ── Communities Manager ────────────────────────────────────────── */}
      {activeTab === 'communities' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">{t('super_admin.communities.title')}</h2>
            <Button id="btn-create-community" size="sm" onClick={() => setShowCreateModal(true)}
              className="gap-1.5 bg-accentPrimary text-white hover:bg-accentPrimary/90 h-9 text-xs">
              <PlusCircle size={14} />
              {t('super_admin.communities.add')}
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <CommunitiesTable communities={communities} t={t} />
          </div>
        </div>
      )}

      {/* ── Onboard Coto Admin ─────────────────────────────────────────── */}
      {activeTab === 'onboard_admin' && (
        <div className="max-w-lg animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-textPrimary">{t('super_admin.onboard.title')}</h2>
              <p className="text-xs text-textMuted mt-1">{t('super_admin.communities.title')}</p>
            </div>
            <OnboardAdminForm
              form={adminForm}
              errors={adminErrors}
              loading={adminLoading}
              success={adminSuccess}
              apiError={adminApiError}
              communities={communities}
              onChange={handleAdminChange}
              onSubmit={handleAdminSubmit}
              t={t}
            />
          </div>
        </div>
      )}

      {/* ── Create Community Dialog ─────────────────────────────────────── */}
      <Dialog open={showCreateModal} onOpenChange={(open) => { if (!communityLoading) setShowCreateModal(open); }}>
        <DialogContent className="bg-card border border-border text-textPrimary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-textPrimary">{t('super_admin.communities.add')}</DialogTitle>
            <DialogDescription className="text-textMuted text-xs">
              {t('super_admin.communities.title')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCommunitySubmit} className="space-y-4 mt-2">
            <FormField label={t('super_admin.communities.name')} id="community-name">
              <Input
                id="community-name"
                value={communityForm.name}
                onChange={(e) => handleCommunityChange('name', e.target.value)}
                className="bg-app border-border text-textPrimary placeholder:text-textMuted"
                placeholder={t('super_admin.communities.name')}
              />
              <FieldError errorKey={communityErrors.name} t={t} />
            </FormField>

            <FormField label={t('super_admin.communities.address')} id="community-address">
              <Input
                id="community-address"
                value={communityForm.address}
                onChange={(e) => handleCommunityChange('address', e.target.value)}
                className="bg-app border-border text-textPrimary placeholder:text-textMuted"
                placeholder={t('super_admin.communities.address')}
              />
              <FieldError errorKey={communityErrors.address} t={t} />
            </FormField>

            <FormField label={t('super_admin.communities.timezone')} id="community-timezone">
              <select
                id="community-timezone"
                value={communityForm.timezone}
                onChange={(e) => handleCommunityChange('timezone', e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary"
              >
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </FormField>

            {communitySuccess && (
              <p className="text-xs text-emerald-500 font-medium">{communitySuccess}</p>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}
                className="flex-1 border-border text-textSecondary" disabled={communityLoading}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={communityLoading}
                className="flex-1 bg-accentPrimary text-white hover:bg-accentPrimary/90">
                {communityLoading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </AppShell>
  );
}

// ── Sub-components (kept in same file for cohesion — small enough) ──────────

function CommunitiesTable({ communities, t }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="text-textMuted text-xs">{t('super_admin.communities.name')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('super_admin.communities.address')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('super_admin.communities.units_count')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('super_admin.communities.managed_by')}</TableHead>
          <TableHead className="text-textMuted text-xs">{t('super_admin.communities.created_date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-textMuted text-xs py-8">
              {t('common.no_data')}
            </TableCell>
          </TableRow>
        ) : (
          communities.map((c) => (
            <TableRow key={c.id} className="border-border hover:bg-hoverBg transition-colors">
              <TableCell className="font-medium text-sm text-textPrimary">{c.name}</TableCell>
              <TableCell className="text-xs text-textSecondary">{c.address}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">{c.units}</Badge>
              </TableCell>
              <TableCell className="text-xs text-textSecondary">{c.admin}</TableCell>
              <TableCell className="text-xs text-textMuted">{c.created}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
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

function OnboardAdminForm({ form, errors, loading, success, apiError, communities, onChange, onSubmit, t }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label={t('super_admin.onboard.first_name')} id="admin-first-name">
          <Input id="admin-first-name" value={form.first_name}
            onChange={(e) => onChange('first_name', e.target.value)}
            className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9"
            placeholder={t('super_admin.onboard.first_name')} />
          <FieldError errorKey={errors.first_name} t={t} />
        </FormField>
        <FormField label={t('super_admin.onboard.last_name')} id="admin-last-name">
          <Input id="admin-last-name" value={form.last_name}
            onChange={(e) => onChange('last_name', e.target.value)}
            className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9"
            placeholder={t('super_admin.onboard.last_name')} />
          <FieldError errorKey={errors.last_name} t={t} />
        </FormField>
      </div>

      <FormField label={t('super_admin.onboard.email')} id="admin-email">
        <Input id="admin-email" type="email" value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9"
          placeholder={t('login.email_placeholder')} />
        <FieldError errorKey={errors.email} t={t} />
      </FormField>

      <FormField label={t('super_admin.onboard.phone')} id="admin-phone">
        <Input id="admin-phone" type="tel" value={form.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="bg-app border-border text-textPrimary placeholder:text-textMuted h-9"
          placeholder="+52 81 0000 0000" />
        <FieldError errorKey={errors.phone} t={t} />
      </FormField>

      <FormField label={t('super_admin.onboard.password')} id="admin-password">
        <Input id="admin-password" type="password" value={form.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="bg-app border-border text-textPrimary h-9" />
        <FieldError errorKey={errors.password} t={t} />
      </FormField>

      <FormField label={t('super_admin.onboard.community_select')} id="admin-community">
        <select
          id="admin-community"
          value={form.community_id}
          onChange={(e) => onChange('community_id', e.target.value)}
          className="w-full h-9 rounded-md border border-border bg-app text-textPrimary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accentPrimary"
        >
          <option value="">{t('super_admin.onboard.community_select')}</option>
          {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <FieldError errorKey={errors.community_id} t={t} />
      </FormField>

      {success  && <p className="text-xs text-emerald-500 font-medium">{success}</p>}
      {apiError && <p className="text-xs text-red-500">{apiError}</p>}

      <Button type="submit" disabled={loading} className="w-full bg-accentPrimary text-white hover:bg-accentPrimary/90">
        {loading ? t('common.loading') : t('super_admin.onboard.submit')}
      </Button>
    </form>
  );
}
