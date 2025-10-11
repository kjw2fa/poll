import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react'; // Import act
import { BrowserRouter } from 'react-router-dom';
import MyPolls from './MyPolls';

import { useLazyLoadQuery } from 'react-relay';

// Mock react-relay
const mockUseLazyLoadQuery = vi.fn();
vi.mock('react-relay', () => ({
  ...vi.importActual('react-relay'),
  useLazyLoadQuery: (query, variables) => mockUseLazyLoadQuery(query, variables),
}));

describe('MyPolls component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login message if userId is not provided', () => {
    render(<MyPolls userId="" />);
    expect(screen.getByText(/Please log in to view your polls./i)).toBeInTheDocument();
  });

  test('renders loading message initially', () => {
    render(
      <BrowserRouter>
        <MyPolls userId="test-user-id" />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders created and voted polls after fetching', async () => {
    mockUseLazyLoadQuery.mockReturnValue({
      myPolls: {
        createdPolls: [{ id: 'c1', title: 'Created Poll 1', creator: { username: 'test-user' } }],
        votedPolls: [{ id: 'v1', title: 'Voted Poll 1', creator: { username: 'test-user' } }],
      },
    });

    render(
      <BrowserRouter>
        <MyPolls userId="test-user-id" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Polls You Created/i)).toBeInTheDocument();
      expect(screen.getByText(/Created Poll 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Polls You Voted On/i)).toBeInTheDocument();
      expect(screen.getByText(/Voted Poll 1/i)).toBeInTheDocument();
    });
  });

  test('renders no polls message if no polls are found', async () => {
    mockUseLazyLoadQuery.mockReturnValue({
      myPolls: {
        createdPolls: [],
        votedPolls: [],
      },
    });

    render(
      <BrowserRouter>
        <MyPolls userId="test-user-id" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No polls created./i)).toBeInTheDocument();
      expect(screen.getByText(/No polls voted on./i)).toBeInTheDocument();
    });
  });
});