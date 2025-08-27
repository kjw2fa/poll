import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Vote from './Vote'; // Assuming Vote.tsx is in the same directory

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
global.fetch = vi.fn((url) => {
  if (url.includes('/api/polls/test-poll-id')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-poll-id',
        title: 'Test Poll',
        options: ['Option A', 'Option B'],
      }),
    });
  }
  if (url.includes('/api/poll/test-poll-id/vote')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ratings: {} }),
    });
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('Vote component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders poll title and options', async () => {
    render(
      <BrowserRouter>
        <Vote userId="test-user-id" />
      </BrowserRouter>
    );

    // Check if loading message is displayed initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the poll data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Test Poll/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Option A/i)).toBeInTheDocument();
    expect(screen.getByText(/Option B/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // You can add more tests here for drag-and-drop, form submission, etc.
});