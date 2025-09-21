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



describe('Vote component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('renders poll title and options', () => {
    const mockPoll = {
      id: 'test-poll-id',
      title: 'Test Poll',
      options: ['Option A', 'Option B'],
      votes: [],
    };

    render(
      <BrowserRouter>
        <Vote userId="test-user-id" poll={mockPoll} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Test Poll/i)).toBeInTheDocument();
    expect(screen.getByText(/Option A/i)).toBeInTheDocument();
    expect(screen.getByText(/Option B/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // You can add more tests here for drag-and-drop, form submission, etc.
});