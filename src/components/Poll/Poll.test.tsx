import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Poll from './Poll';

// Mock react-router-dom at the top level
import { useParams, useNavigate } from 'react-router-dom'; // Import the actual functions
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(), // Mock useParams
    useNavigate: vi.fn(), // Mock useNavigate
  };
});

// Mock child components
vi.mock('./Vote/Vote', () => ({ default: ({ userId }) => <div>Mock Vote Component for {userId}</div> }));
vi.mock('./PollResults/PollResults', () => ({ default: () => <div>Mock PollResults Component</div> }));
vi.mock('./EditPoll/EditPoll', () => ({ default: ({ userId, poll }) => <div>Mock EditPoll Component for {userId} - {poll?.title}</div> }));
vi.mock('./PollSearch/PollSearch', () => ({ default: ({ onSearch }) => <input placeholder="Enter Poll ID" onChange={(e) => onSearch(e.target.value)} /> }));


// Mock fetch globally
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
  if (url.includes('/api/poll/test-poll-id/permissions')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ canEdit: true }),
    });
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('Poll component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders poll title and tabs', async () => {
    useParams.mockReturnValue({ id: 'test-poll-id' });
    useNavigate.mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <Poll userId="test-user-id" />
      </BrowserRouter>
    );

    // Wait for the poll data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Test Poll/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('tab', { name: /Vote/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Results/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Edit/i })).toBeInTheDocument(); // Assuming canEdit is true
  });

  test('renders PollSearch if no id is provided', async () => {
    useParams.mockReturnValue({}); // No ID
    useNavigate.mockReturnValue(vi.fn());

    render(
      <BrowserRouter>
        <Poll userId="test-user-id" />
      </BrowserRouter>
    );

    // PollSearch component is mocked to render an input with placeholder "Enter Poll ID"
    expect(screen.getByPlaceholderText(/Enter Poll ID/i)).toBeInTheDocument();
  });
});