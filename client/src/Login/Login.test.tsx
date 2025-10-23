import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Mock react-relay
const mockCommitMutation = vi.fn();
vi.mock('react-relay', () => ({
  ...vi.importActual('react-relay'),
  useMutation: () => [mockCommitMutation, false],
}));

describe('Login component', () => {
  beforeEach(() => {
    vi.clearAllMMocks();
  });

  test('renders login form', () => {
    render(<Login onLogin={() => {}} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('calls login mutation on form submission', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={() => {}} />);

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockCommitMutation).toHaveBeenCalledTimes(1);
      expect(mockCommitMutation).toHaveBeenCalledWith({
        variables: {
          username: 'testuser',
          password: 'password',
        },
        onCompleted: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  test('calls onLogin on successful login', async () => {
    const onLogin = vi.fn();
    const user = userEvent.setup();
    render(<Login onLogin={onLogin} />);

    await user.click(screen.getByRole('button', { name: /Login/i }));

    // Simulate onCompleted
    const onCompleted = mockCommitMutation.mock.calls[0][0].onCompleted;
    onCompleted({
      login: {
        token: 'test-token',
        userId: 'test-user-id',
        username: 'test-user',
      },
    });

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledTimes(1);
      expect(onLogin).toHaveBeenCalledWith({
        token: 'test-token',
        userId: 'test-user-id',
        username: 'test-user',
      });
    });
  });

  test('displays error message on failed login', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Login/i }));

    // Simulate onError
    const onError = mockCommitMutation.mock.calls[0][0].onError;
    onError(new Error('Login failed.'));

    await waitFor(() => {
      expect(screen.getByText('Login failed.')).toBeInTheDocument();
    });
  });
});
