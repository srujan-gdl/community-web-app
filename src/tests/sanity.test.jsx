import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Sanity Test Suite', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a simple component successfully', () => {
    render(<div data-testid="sanity-div">CotoGate Admin Portal</div>);
    const element = screen.getByTestId('sanity-div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('CotoGate Admin Portal');
  });
});
