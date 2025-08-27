import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  test('renders with default variant and size', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary'); // Check for default variant class
    expect(button).toHaveClass('h-9'); // Check for default size class
  });

  test('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /Delete/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  test('renders with custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /Custom/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('custom-class');
  });

  test('renders as a child component when asChild is true', () => {
    render(<Button asChild><a href="/test">Link</a></Button>);
    const link = screen.getByRole('link', { name: /Link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link.tagName).toBe('A'); // Ensure it renders as an anchor tag
  });
});
