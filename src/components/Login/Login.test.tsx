import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

// Mock fetch
global.fetch = vi.fn((url, options) => {
  if (url.includes('/api/login')) {
    if (options?.method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.username === 'testuser' && body.password === 'password123') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: 'mock-token',
            userId: 'mock-user-id',
            username: 'testuser',
          }),
        });
      } else {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        });
      }
    }
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('Login component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); // Clear localStorage before each test
  });

  test('renders login form', () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        })
      );
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(localStorage.getItem('userId')).toBe('mock-user-id');
      expect(localStorage.getItem('username')).toBe('testuser');
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
      expect(mockOnLogin).toHaveBeenCalledWith({
        token: 'mock-token',
        userId: 'mock-user-id',
        username: 'testuser',
      });
    });
  });

  test('handles failed login', async () => {
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });
});
