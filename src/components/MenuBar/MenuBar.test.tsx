import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MenuBar from './MenuBar';

// Mock Header component
vi.mock('../Header/Header', () => ({
  default: ({ loggedIn, username, onLogout }) => (
    <div>
      {loggedIn ? (
        <>
          <span>Welcome, {username}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/signup">Create Account</a>
          <a href="/login">Login</a>
        </>
      )}
    </div>
  ),
}));

// Mock react-router-dom at the top level
import { useLocation } from 'react-router-dom'; // Import the actual function
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: vi.fn(), // Mock useLocation
  };
});

describe('MenuBar component', () => {
  const mockOnLogout = vi.fn(); // Define mockOnLogout here

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation links', () => {
    useLocation.mockReturnValue({ pathname: '/' }); // Default mock for useLocation
    render(
      <BrowserRouter>
        <MenuBar loggedIn={false} username="" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create Poll/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Polls/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /My Polls/i })).toBeInTheDocument();
  });

  test('links have correct href attributes', () => {
    useLocation.mockReturnValue({ pathname: '/' }); // Default mock for useLocation
    render(
      <BrowserRouter>
        <MenuBar loggedIn={false} username="" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Create Poll/i })).toHaveAttribute('href', '/create');
    expect(screen.getByRole('link', { name: /View Polls/i })).toHaveAttribute('href', '/poll');
    expect(screen.getByRole('link', { name: /My Polls/i })).toHaveAttribute('href', '/mypolls');
  });

  test('renders login/signup links when not logged in', () => {
    useLocation.mockReturnValue({ pathname: '/' }); // Default mock for useLocation
    render(
      <BrowserRouter>
        <MenuBar loggedIn={false} username="" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  test('renders welcome message and logout button when logged in', () => {
    useLocation.mockReturnValue({ pathname: '/' }); // Default mock for useLocation
    render(
      <BrowserRouter>
        <MenuBar loggedIn={true} username="testuser" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Create Account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    useLocation.mockReturnValue({ pathname: '/' }); // Default mock for useLocation
    render(
      <BrowserRouter>
        <MenuBar loggedIn={true} username="testuser" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('applies active class to current page link', () => {
    useLocation.mockReturnValue({ pathname: '/create' }); // Mock useLocation for this test

    render(
      <BrowserRouter>
        <MenuBar loggedIn={false} username="" onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).not.toHaveClass('active');
    expect(screen.getByRole('link', { name: /Create Poll/i })).toHaveClass('active');
    expect(screen.getByRole('link', { name: /View Polls/i })).not.toHaveClass('active');
    expect(screen.getByRole('link', { name: /My Polls/i })).not.toHaveClass('active');
  });
});