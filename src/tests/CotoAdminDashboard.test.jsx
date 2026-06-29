import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CotoAdminDashboard from '../components/CotoAdminDashboard';
import { I18nProvider } from '../i18n/i18nContext';
import { ThemeProvider } from '../themeContext';
import { SessionProvider } from '../context/SessionContext';

vi.mock('../lib/api', () => ({
  createUnit: vi.fn().mockResolvedValue({ id: 'unit-new' }),
  onboardResident: vi.fn().mockResolvedValue({ message: 'ok' }),
  linkUserToUnit: vi.fn().mockResolvedValue({ message: 'ok' }),
}));

const MOCK_COTO_USER = {
  id: 'usr-coto',
  first_name: 'Alex',
  last_name: 'Ramos',
  email: 'admin@cotogate.com',
  role: 'coto_admin',
  managed_community_id: 'comm-1',
  must_change_password: false,
  communities: [],
};

/** Helper: access element by HTML id */
const byId = (id) => document.getElementById(id);

function withProviders(ui, user = MOCK_COTO_USER) {
  sessionStorage.setItem('cotogate_token', 'mock-token');
  sessionStorage.setItem('cotogate_user', JSON.stringify(user));
  return render(
    <ThemeProvider>
      <I18nProvider>
        <SessionProvider>{ui}</SessionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

describe('CotoAdminDashboard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the 4 dashboard stat cards', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    expect(screen.getByText(/occupied homes|casas ocupadas/i)).toBeInTheDocument();
    expect(screen.getByText(/active residents|residentes activos/i)).toBeInTheDocument();
    expect(screen.getByText(/pending hoa|saldo pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/visitors|visitas/i)).toBeInTheDocument();
  });

  it('navigates to the Units tab and shows unit grid', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-units'));
    await screen.findByText(/property units|gestor de unidades/i);

    expect(screen.getByText('A-101')).toBeInTheDocument();
    expect(screen.getByText('B-203')).toBeInTheDocument();
  });

  it('opens Unit Scaffold modal and validates empty submission', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-units'));
    await screen.findByText(/property units|gestor de unidades/i);

    fireEvent.click(byId('btn-scaffold-unit'));
    await screen.findByLabelText(/house number|número de casa/i);

    // Submit empty → validation errors
    fireEvent.click(screen.getByRole('button', { name: /save|guardar/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/required|obligatorio/i).length).toBeGreaterThan(0);
    });
  });

  it('successfully creates a new unit', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-units'));
    fireEvent.click(byId('btn-scaffold-unit'));

    await screen.findByLabelText(/house number|número de casa/i);
    fireEvent.change(byId('unit-house'),   { target: { value: '999' } });
    fireEvent.change(byId('unit-block'),   { target: { value: 'Z' } });
    fireEvent.change(byId('unit-balance'), { target: { value: '0' } });

    fireEvent.click(screen.getByRole('button', { name: /save|guardar/i }));
    await waitFor(() => {
      expect(screen.getByText(/success|exitoso/i)).toBeInTheDocument();
    });
  });

  it('navigates to Residents tab and shows seed residents', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-residents'));
    await screen.findByText(/resident directory|directorio de residentes/i);

    expect(screen.getByText('María García')).toBeInTheDocument();
    expect(screen.getByText('Juan López')).toBeInTheDocument();
  });

  it('opens Onboard Resident modal and shows validation errors on empty submit', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-residents'));
    await screen.findByText(/resident directory|directorio de residentes/i);
    fireEvent.click(byId('btn-onboard-resident'));

    // Wait for the modal's first-name input to appear
    await waitFor(() => expect(byId('res-first-name')).toBeTruthy());

    // Submit completely empty form
    fireEvent.click(screen.getAllByRole('button', { name: /save|guardar/i })[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/required|obligatorio/i).length).toBeGreaterThan(0);
    });
  });

  it('navigates to Guards tab and shows seed guards', async () => {
    withProviders(<CotoAdminDashboard />);
    await screen.findByText(/coto operations|operaciones del coto/i);

    fireEvent.click(byId('nav-guards'));
    await screen.findByText(/guard station|cuentas de caseta/i);

    expect(screen.getByText('Guardia Robles')).toBeInTheDocument();
  });
});
