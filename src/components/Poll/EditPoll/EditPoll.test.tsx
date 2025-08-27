import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditPoll from './EditPoll';

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({
      id: 'test-poll-id',
    }),
  };
});

// Mock fetch
global.fetch = vi.fn((url, options) => {
  if (url.includes('/api/poll/test-poll-id/edit')) {
    if (options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Poll updated!' }),
      });
    }
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('EditPoll component', () => {
  const mockPoll = {
    id: 'test-poll-id',
    title: 'Original Poll Title',
    options: ['Option 1', 'Option 2'],
  };
  const mockOnPollUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders PollSettings with initial poll data', () => {
    render(
      <BrowserRouter>
        <EditPoll userId="test-user-id" poll={mockPoll} onPollUpdated={mockOnPollUpdated} />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue('Original Poll Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  test('calls onSave and onPollUpdated when form is submitted', async () => {
    render(
      <BrowserRouter>
        <EditPoll userId="test-user-id" poll={mockPoll} onPollUpdated={mockOnPollUpdated} />
      </BrowserRouter>
    );

    const titleInput = screen.getByDisplayValue('Original Poll Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Poll Title' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/poll/test-poll-id/edit',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            userId: 'test-user-id',
            title: 'Updated Poll Title',
            options: ['Option 1', 'Option 2'],
          }),
        })
      );
      expect(mockOnPollUpdated).toHaveBeenCalledTimes(1);
      expect(mockOnPollUpdated).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Poll Title',
          options: ['Option 1', 'Option 2'],
        })
      );
      expect(screen.getByText('Poll updated!')).toBeInTheDocument();
    });
  });
});
