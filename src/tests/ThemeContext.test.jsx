import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from '../themeContext';

const TestComponent = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="resolved-val">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')} data-testid="btn-light">Set Light</button>
      <button onClick={() => setTheme('dark')} data-testid="btn-dark">Set Dark</button>
      <button onClick={() => setTheme('system')} data-testid="btn-system">Set System</button>
    </div>
  );
};

describe('ThemeContext Provider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with default system theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val')).toHaveTextContent('system');
  });

  it('should update theme and document class when dark theme is manually selected', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const btnDark = screen.getByTestId('btn-dark');
    
    act(() => {
      btnDark.click();
    });

    expect(screen.getByTestId('theme-val')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-val')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('cotogate_theme')).toBe('dark');
  });

  it('should remove dark class when light theme is selected', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const btnLight = screen.getByTestId('btn-light');

    act(() => {
      btnLight.click();
    });

    expect(screen.getByTestId('theme-val')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved-val')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('cotogate_theme')).toBe('light');
  });
});
