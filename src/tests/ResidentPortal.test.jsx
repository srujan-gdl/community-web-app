import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResidentPortal from '../components/ResidentPortal';
import { I18nProvider } from '../i18n/i18nContext';
import { ThemeProvider } from '../themeContext';
import { SessionProvider } from '../context/SessionContext';

const MOCK_RESIDENT_USER = {
  id: 'usr-resident',
  first_name: 'Carlos',
  last_name: 'Perez',
  email: 'resident@cotogate.com',
  role: 'resident_owner',
  must_change_password: false,
  communities: [
    {
      id: 'comm-1',
      name: 'Residencial Las Palmas',
      units: [{ id: 'unit-1', block_number: 'A', house_number: '101', relationship: 'owner' }],
    },
  ],
};

/** Helper: access element by HTML id */
const byId = (id) => document.getElementById(id);

function withProviders(ui, user = MOCK_RESIDENT_USER) {
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

describe('ResidentPortal', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the dashboard with community name and balance card', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    expect(screen.getByText('Residencial Las Palmas')).toBeInTheDocument();
    expect(screen.getByText(/outstanding balance|saldo pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/\$4,800/)).toBeInTheDocument();
  });

  it('opens the Stripe payment modal and shows the balance amount', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    fireEvent.click(byId('btn-pay-stripe'));

    // Stripe modal opens and shows balance
    await screen.findByLabelText(/card details|detalles de tarjeta/i);
    expect(screen.getAllByText(/\$4,800/).length).toBeGreaterThan(0);
  });

  it('simulates a successful Stripe payment and clears the balance', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    fireEvent.click(byId('btn-pay-stripe'));
    await screen.findByLabelText(/card details|detalles de tarjeta/i);

    fireEvent.change(byId('stripe-card-number'), { target: { value: '4242424242424242' } });
    fireEvent.change(byId('stripe-expiry'), { target: { value: '12 / 28' } });
    fireEvent.change(byId('stripe-cvv'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /authorize|autorizar/i }));

    // Success message inside the modal (with setTimeout simulation)
    await waitFor(() => {
      expect(screen.getByText(/payment approved|pago aprobado/i)).toBeInTheDocument();
    }, { timeout: 4000 });

    // After success closes the modal the dashboard shows cleared state
    await waitFor(() => {
      expect(screen.getByText(/account cleared|cuenta al corriente/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('navigates to RFID tab and shows all seeded RFID cards', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    fireEvent.click(byId('nav-rfids'));
    // Wait for the page heading in the RFID tab
    await screen.findByText(/rfid keycards|tarjetas rfid y llaveros/i);

    expect(screen.getByText('0x8A79B1')).toBeInTheDocument();
    // Carlos Perez appears in both header and table — use getAllByText
    expect(screen.getAllByText('Carlos Perez').length).toBeGreaterThan(0);
  });

  it('opens RFID deactivation confirm dialog and confirms deactivation', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    fireEvent.click(byId('nav-rfids'));
    await screen.findByText(/rfid keycards|tarjetas rfid y llaveros/i);

    // Click deactivate on the first active card
    fireEvent.click(byId('btn-deactivate-rfid-1'));

    // Confirmation dialog opens
    await screen.findByText(/confirm deactivation|confirmar desactivación/i);
    fireEvent.click(screen.getByRole('button', { name: /^confirm$|^confirmar$/i }));

    // Card status should become suspended (shown as inactive)
    await waitFor(() => {
      const badges = screen.getAllByText(/inactive|inactivo/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('navigates to Payments tab and shows payment history', async () => {
    withProviders(<ResidentPortal />);
    await screen.findByText(/resident dashboard|panel de residente/i);

    fireEvent.click(byId('nav-payments'));
    await screen.findByText(/payment history|historial de pagos/i);

    expect(screen.getAllByText(/\$4,800/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('SPEI').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Stripe').length).toBeGreaterThan(0);
  });
});
