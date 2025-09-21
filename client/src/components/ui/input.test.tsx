import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';

describe('Input component', () => {
  test('renders with default type text', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders with specified type', () => {
    render(<Input type="password" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders with custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('custom-class');
  });
});
