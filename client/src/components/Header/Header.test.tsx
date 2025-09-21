import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header component', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login/signup links when not logged in', () => {
    render(
      <BrowserRouter>
        <Header loggedIn={false} username="" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  test('renders welcome message and logout button when logged in', () => {
    render(
      <BrowserRouter>
        <Header loggedIn={true} username="testuser" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Create Account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    render(
      <BrowserRouter>
        <Header loggedIn={true} username="testuser" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
