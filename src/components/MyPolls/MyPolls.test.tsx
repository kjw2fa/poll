import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react'; // Import act
import { BrowserRouter } from 'react-router-dom';
import MyPolls from './MyPolls';

// Mock fetch
global.fetch = vi.fn((url) => {
  if (url.includes('/api/user/test-user-id/polls')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        createdPolls: [{ id: 'c1', title: 'Created Poll 1' }],
        votedPolls: [{ id: 'v1', title: 'Voted Poll 1' }],
      }),
    });
  }
  return Promise.reject(new Error('unknown fetch URL'));
});

describe('MyPolls component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login message if userId is not provided', () => {
    render(<MyPolls userId="" />);
    expect(screen.getByText(/Please log in to view your polls./i)).toBeInTheDocument();
  });

  test('renders loading message initially', async () => { // Added async
    render( // Render outside act to assert initial state
      <BrowserRouter>
        <MyPolls userId="test-user-id" />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Assert initial loading state

    await act(async () => { // Wrap the async operation in act
      // No need to re-render here, just let the fetch and state updates complete
    });

    // Ensure the loading state is resolved after act
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  test('renders created and voted polls after fetching', async () => {
    let component;
    await act(async () => { // Wrap render in act
      component = render(
        <BrowserRouter>
          <MyPolls userId="test-user-id" />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Polls You Created/i)).toBeInTheDocument();
      expect(screen.getByText(/Created Poll 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Polls You Voted On/i)).toBeInTheDocument();
      expect(screen.getByText(/Voted Poll 1/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/user/test-user-id/polls');
  });

  test('renders no polls message if no polls are found', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ createdPolls: [], votedPolls: [] }),
      })
    );

    let component;
    await act(async () => { // Wrap render in act
      component = render(
        <BrowserRouter>
          <MyPolls userId="test-user-id" />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/No polls created./i)).toBeInTheDocument();
      expect(screen.getByText(/No polls voted on./i)).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let component;
    await act(async () => { // Wrap render in act
      component = render(
        <BrowserRouter>
          <MyPolls userId="test-user-id" />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching my polls:', expect.any(Error));
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});