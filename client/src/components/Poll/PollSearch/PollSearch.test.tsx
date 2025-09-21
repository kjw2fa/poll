import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PollSearch from './PollSearch';

// Mock react-router-dom at the top level
import { useNavigate } from 'react-router-dom'; // Import the actual function
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(), // Mock useNavigate
  };
});

describe('PollSearch component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders search input and button', () => {
    render(
      <BrowserRouter>
        <PollSearch onSearch={mockOnSearch} />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Enter Poll ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('calls onSearch and navigates when search button is clicked with valid ID', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate); // Use the imported useNavigate

    render(
      <BrowserRouter>
        <PollSearch onSearch={mockOnSearch} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter Poll ID/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    await user.type(input, '123');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('123');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/poll/123');
  });

  test('calls onSearch and navigates when Enter key is pressed with valid ID', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate); // Use the imported useNavigate

    render(
      <BrowserRouter>
        <PollSearch onSearch={mockOnSearch} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter Poll ID/i);

    await user.type(input, '456{enter}'); // Type and press Enter

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('456');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/poll/456');
  });

  test('does not call onSearch or navigate with empty ID', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate); // Use the imported useNavigate

    render(
      <BrowserRouter>
        <PollSearch onSearch={mockOnSearch} />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /Search/i });

    await user.click(searchButton); // Click without typing

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});