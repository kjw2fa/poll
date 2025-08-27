import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePoll from './CreatePoll';

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

// Mock fetch
global.fetch = vi.fn((url, options) => {
  if (url.includes('/api/polls')) {
    if (options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'new-poll-id' }),
      });
    }
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('CreatePoll component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error to prevent it from logging during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Restore original console.error
  });

  test('renders PollSettings initially', () => {
    render(<CreatePoll userId="test-user-id" />);
    expect(screen.getByText('Mock PollSettings Component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
  });

  test('displays success message and poll URL after poll creation', async () => {
    const user = userEvent.setup();
    render(<CreatePoll userId="test-user-id" />);

    // Simulate saving the poll from PollSettings
    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/polls',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'Mock Poll',
            options: ['Opt1', 'Opt2'],
            userId: 'test-user-id',
          }),
        })
      );
      expect(screen.getByText('Poll Created Successfully!')).toBeInTheDocument();
      expect(screen.getByText(/Poll ID: new-poll-id/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /http:\/\/localhost:3000\/poll\/new-poll-id/i })).toBeInTheDocument();
    });
  });

  test('logs error message if poll creation fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to create poll' }),
      })
    );

    const user = userEvent.setup();
    render(<CreatePoll userId="test-user-id" />);

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create poll');
    });
  });
});