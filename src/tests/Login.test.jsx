import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Login from '../components/Login';
import { I18nProvider } from '../i18n/i18nContext';
import { ThemeProvider } from '../themeContext';

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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('should call onLoginSuccess for a standard login (must_change_password: false)', () => {
    const onLoginSuccessMock = vi.fn();
    renderLogin({ onLoginSuccess: onLoginSuccessMock });

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitBtn = screen.getByRole('button', { name: /acceder/i });

    fireEvent.change(emailInput, { target: { value: 'guard@cotogate.com' } });
    fireEvent.change(passwordInput, { target: { value: 'permanent123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/autenticando/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onLoginSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'guard@cotogate.com',
        role: 'guard',
        must_change_password: false,
      })
    );
  });

  it('should display the forced password reset modal when user is flagged with must_change_password: true', () => {
    const onLoginSuccessMock = vi.fn();
    renderLogin({ onLoginSuccess: onLoginSuccessMock });

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitBtn = screen.getByRole('button', { name: /acceder/i });

    fireEvent.change(emailInput, { target: { value: 'admin@cotogate.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitBtn);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/restablecer contraseña obligatorio/i)).toBeInTheDocument();

    // Verify modal elements exist
    expect(screen.getByLabelText(/nueva contraseña segura/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar nueva contraseña/i)).toBeInTheDocument();
  });
});
