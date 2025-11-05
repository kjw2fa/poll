import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label component', () => {
  test('renders children correctly', () => {
    render(<Label>My Label</Label>);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  test('renders with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Input Label</Label>);
    expect(screen.getByText('Input Label')).toHaveAttribute('for', 'test-input');
  });

  test('renders with custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>);
    const label = screen.getByText('Custom Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('custom-label');
  });
});
