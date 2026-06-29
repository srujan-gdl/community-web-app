import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SuperAdminDashboard from '../components/SuperAdminDashboard';
import { I18nProvider } from '../i18n/i18nContext';
import { ThemeProvider } from '../themeContext';
import { SessionProvider } from '../context/SessionContext';

vi.mock('../lib/api', () => ({
  createCommunity: vi.fn().mockResolvedValue({ id: 'comm-new', name: 'Test Coto' }),
  onboardCotoAdmin: vi.fn().mockResolvedValue({ message: 'ok' }),
}));

const MOCK_SUPER_USER = {
  id: 'usr-super',
  first_name: 'Super',
  last_name: 'Admin',
  email: 'superadmin@cotogate.com',
  role: 'super_admin',
  must_change_password: false,
  communities: [],
};

/** Helper: get element by its HTML id attribute */
const byId = (id) => document.getElementById(id);

function withProviders(ui, user = MOCK_SUPER_USER) {
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

describe('SuperAdminDashboard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the dashboard overview with stat cards', async () => {
    withProviders(<SuperAdminDashboard />);
    await screen.findByText(/enterprise overview|resumen empresarial/i);
    expect(screen.getByText(/total communities|total de comunidades/i)).toBeInTheDocument();
    expect(screen.getByText(/active coto admins|administradores de coto/i)).toBeInTheDocument();
  });

  it('navigates to the Communities tab and shows the seed communities', async () => {
    withProviders(<SuperAdminDashboard />);
    await screen.findByText(/enterprise overview|resumen empresarial/i);

    fireEvent.click(byId('nav-communities'));
    await screen.findByText('Residencial Las Palmas');
    expect(screen.getByText('Valle Imperial')).toBeInTheDocument();
    expect(screen.getByText('Aura Altitude')).toBeInTheDocument();
  });

  it('opens and submits the Create Community modal', async () => {
    withProviders(<SuperAdminDashboard />);
    await screen.findByText(/enterprise overview|resumen empresarial/i);

    fireEvent.click(byId('nav-communities'));
    await screen.findByText('Residencial Las Palmas');
    fireEvent.click(byId('btn-create-community'));

    const nameInput = await screen.findByLabelText(/community name|nombre del coto/i);
    const addressInput = document.getElementById('community-address');

    fireEvent.change(nameInput, { target: { value: 'Nuevo Coto Test' } });
    fireEvent.change(addressInput, { target: { value: 'Calle Falsa 123' } });

    fireEvent.click(screen.getByRole('button', { name: /save|guardar/i }));

    await waitFor(() => {
      expect(screen.getByText(/created successfully|creada con éxito/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors when submitting empty Create Community form', async () => {
    withProviders(<SuperAdminDashboard />);
    await screen.findByText(/enterprise overview|resumen empresarial/i);

    fireEvent.click(byId('nav-communities'));
    await screen.findByText('Residencial Las Palmas');
    fireEvent.click(byId('btn-create-community'));

    await screen.findByLabelText(/community name|nombre del coto/i);
    fireEvent.click(screen.getByRole('button', { name: /save|guardar/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required|obligatorio/i).length).toBeGreaterThan(0);
    });
  });

  it('navigates to Onboard Coto Admin tab and submits the form', async () => {
    withProviders(<SuperAdminDashboard />);
    await screen.findByText(/enterprise overview|resumen empresarial/i);

    fireEvent.click(byId('nav-onboard_admin'));
    await screen.findByLabelText(/first name|nombre/i);

    fireEvent.change(document.getElementById('admin-first-name'), { target: { value: 'Carlos' } });
    fireEvent.change(document.getElementById('admin-last-name'),  { target: { value: 'Ruiz' } });
    fireEvent.change(document.getElementById('admin-email'),      { target: { value: 'carlos@coto.com' } });
    fireEvent.change(document.getElementById('admin-phone'),      { target: { value: '+528100000000' } });
    fireEvent.change(document.getElementById('admin-password'),   { target: { value: 'SecurePass1!' } });
    fireEvent.change(document.getElementById('admin-community'),  { target: { value: 'comm-1' } });

    fireEvent.click(screen.getByRole('button', { name: /register coto admin|registrar administrador/i }));

    await waitFor(() => {
      expect(screen.getByText(/registered successfully|registrado con éxito/i)).toBeInTheDocument();
    });
  });
});
