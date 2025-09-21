import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePoll from './CreatePoll';
import { useMutation } from 'react-relay';

// Mock PollSettings component
vi.mock('../PollSettings/PollSettings', () => ({
  default: ({ onSave, isEditing }) => (
    <div>
      Mock PollSettings Component
      <button onClick={() => onSave({ title: 'Mock Poll', options: ['Opt1', 'Opt2'] })}>
        {isEditing ? 'Save Changes' : 'Create Poll'}
      </button>
    </div>
  ),
}));

// Mock react-relay
const mockCommitMutation = vi.fn();
vi.mock('react-relay', () => ({
  ...vi.importActual('react-relay'),
  useMutation: () => [mockCommitMutation, false],
}));

describe('CreatePoll component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('renders PollSettings initially', () => {
    render(<CreatePoll userId="test-user-id" />);
    expect(screen.getByText('Mock PollSettings Component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
  });

  test('displays success message and poll URL after poll creation', async () => {
    const user = userEvent.setup();
    render(<CreatePoll userId="test-user-id" />);

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(mockCommitMutation).toHaveBeenCalledTimes(1);
      expect(mockCommitMutation).toHaveBeenCalledWith({
        variables: {
          title: 'Mock Poll',
          options: ['Opt1', 'Opt2'],
          userId: 'test-user-id',
        },
        onCompleted: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    // Simulate onCompleted
    const onCompleted = mockCommitMutation.mock.calls[0][0].onCompleted;
    onCompleted({
      createPoll: {
        id: 'new-poll-id',
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Poll Created Successfully!')).toBeInTheDocument();
      expect(screen.getByText(/Poll ID: new-poll-id/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /http:\/\/localhost:3000\/poll\/new-poll-id/i })).toBeInTheDocument();
    });
  });

  test('logs error message if poll creation fails', async () => {
    const user = userEvent.setup();
    render(<CreatePoll userId="test-user-id" />);

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(mockCommitMutation).toHaveBeenCalledTimes(1);
    });

    // Simulate onError
    const onError = mockCommitMutation.mock.calls[0][0].onError;
    onError(new Error('Failed to create poll'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating poll:', new Error('Failed to create poll'));
    });
  });
});
