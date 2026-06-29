import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../components/Login';
import { I18nProvider } from '../i18n/i18nContext';
import { ThemeProvider } from '../themeContext';

// Mock the loginWithApi function so tests run fully offline.
// Each test can override the resolved value with vi.mocked().mockResolvedValueOnce(...)
vi.mock('../lib/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    loginWithApi: vi.fn(),
  };
});

// Import the mock *after* vi.mock so we get the mocked version
import { loginWithApi } from '../lib/auth';

const renderLogin = (props = {}) => {
  return render(
    <ThemeProvider>
      <I18nProvider>
        <Login onLoginSuccess={vi.fn()} onBackToHome={vi.fn()} {...props} />
      </I18nProvider>
    </ThemeProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form and animated SVGs', () => {
    renderLogin();
    expect(screen.getByText('Centro de Control CotoGate')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('should show an error if fields are submitted empty', () => {
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /acceder/i });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/por favor ingrese tanto/i)).toBeInTheDocument();
  });

  it('should call onLoginSuccess for a standard login (must_change_password: false)', async () => {
    const onLoginSuccessMock = vi.fn();
    loginWithApi.mockResolvedValueOnce({
      success: true,
      token: 'mock-jwt',
      user: {
        id: 'usr-guard',
        first_name: 'Guardia',
        last_name: 'Robles',
        email: 'guard@cotogate.com',
        role: 'guard',
        must_change_password: false,
        communities: []
      }
    });

    renderLogin({ onLoginSuccess: onLoginSuccessMock });

    fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), {
      target: { value: 'guard@cotogate.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'permanent123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /acceder/i }));

    // Spinner appears while async call is in flight
    expect(screen.getByText(/autenticando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(onLoginSuccessMock).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'guard@cotogate.com',
          role: 'guard',
          must_change_password: false,
        })
      );
    });
  });

  it('should display the forced password reset modal when must_change_password is true', async () => {
    loginWithApi.mockResolvedValueOnce({
      success: true,
      token: 'mock-jwt',
      user: {
        id: 'usr-coto',
        first_name: 'Alex',
        last_name: 'Ramos',
        email: 'admin@cotogate.com',
        role: 'coto_admin',
        must_change_password: true,
        communities: []
      }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), {
      target: { value: 'admin@cotogate.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'admin123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /acceder/i }));

    await waitFor(() => {
      expect(screen.getByText(/restablecer contraseña obligatorio/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/nueva contraseña segura/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar nueva contraseña/i)).toBeInTheDocument();
  });

  it('should show a network error message when the server is unreachable', async () => {
    loginWithApi.mockResolvedValueOnce({
      success: false,
      errorKey: 'login.error.network'
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), {
      target: { value: 'anyone@cotogate.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'somepassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /acceder/i }));

    await waitFor(() => {
      expect(screen.getByText(/no se puede conectar/i)).toBeInTheDocument();
    });
  });

  it('should show invalid credentials error on 401 response', async () => {
    loginWithApi.mockResolvedValueOnce({
      success: false,
      errorKey: 'login.error.invalid'
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('nombre@ejemplo.com'), {
      target: { value: 'wrong@cotogate.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /acceder/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
