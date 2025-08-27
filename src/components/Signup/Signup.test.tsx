import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';

// Mock fetch
global.fetch = vi.fn((url, options) => {
  if (url.includes('/api/signup')) {
    if (options?.method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.username === 'newuser' && body.email === 'newuser@example.com' && body.password === 'newpassword123') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Signup successful!' }),
        });
      } else {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Signup failed.' }),
        });
      }
    }
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('Signup component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders signup form', () => {
    render(<Signup />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('handles successful signup', async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/signup',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'newpassword123',
          }),
        })
      );
      expect(screen.getByText('Signup successful!')).toBeInTheDocument();
    });
  });

  test('handles failed signup', async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'anypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Signup failed.')).toBeInTheDocument();
    });
  });
});
