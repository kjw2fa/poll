import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';

// Mock fetch
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from './Signup';
import { useMutation } from 'react-relay';

// Mock react-relay
const mockCommitMutation = vi.fn();
vi.mock('react-relay', () => ({
  ...vi.importActual('react-relay'),
  useMutation: () => [mockCommitMutation, false],
}));

describe('Signup component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders signup form', () => {
    render(<Signup />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('calls signup mutation on form submission', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockCommitMutation).toHaveBeenCalledTimes(1);
      expect(mockCommitMutation).toHaveBeenCalledWith({
        variables: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        },
        onCompleted: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  test('displays success message on successful signup', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.click(screen.getByRole('button', { name: /Create Account/i }));

    // Simulate onCompleted
    const onCompleted = mockCommitMutation.mock.calls[0][0].onCompleted;
    onCompleted({});

    await waitFor(() => {
      expect(screen.getByText('Signup successful!')).toBeInTheDocument();
    });
  });

  test('displays error message on failed signup', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.click(screen.getByRole('button', { name: /Create Account/i }));

    // Simulate onError
    const onError = mockCommitMutation.mock.calls[0][0].onError;
    onError(new Error('Signup failed.'));

    await waitFor(() => {
      expect(screen.getByText('Signup failed.')).toBeInTheDocument();
    });
  });
});
