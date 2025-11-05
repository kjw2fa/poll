import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PollForm from './PollForm';
import { vi } from 'vitest';

describe('PollForm component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form fields for creating a new poll', () => {
    render(<PollForm onSubmit={mockOnSubmit} poll={null} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Option/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Option/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
  });

  test('renders form fields for editing an existing poll', () => {
    const mockPoll = {
      title: 'Existing Poll',
      options: ['Opt1', 'Opt2'],
    };
    render(<PollForm poll={mockPoll} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('Existing Poll')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  test('adds a new option', async () => {
    const user = userEvent.setup();
    render(<PollForm onSubmit={mockOnSubmit} poll={null} />);

    const addOptionInput = screen.getByLabelText(/Add Option/i);
    const addOptionButton = screen.getByRole('button', { name: /Add Option/i });

    await user.type(addOptionInput, 'New Option');
    await user.click(addOptionButton);

    expect(screen.getByDisplayValue('New Option')).toBeInTheDocument();
    expect(addOptionInput).toHaveValue(''); // Input should be cleared
  });

  test('removes an option', async () => {
    const user = userEvent.setup();
    const mockPoll = {
      title: 'Existing Poll',
      options: ['Opt1', 'Opt2'],
    };
    render(<PollForm poll={mockPoll} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('Opt1')).toBeInTheDocument();
    const removeButton = screen.getAllByRole('button', { name: /X/i })[0]; // Get the first remove button
    await user.click(removeButton);

    expect(screen.queryByDisplayValue('Opt1')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt2')).toBeInTheDocument();
  });

  test('calls onSubmit with correct data when creating a poll', async () => {
    const user = userEvent.setup();
    render(<PollForm onSubmit={mockOnSubmit} poll={null} />);

    await user.type(screen.getByLabelText(/Title/i), 'My New Poll');
    await user.type(screen.getByLabelText(/Add Option/i), 'Option A');
    await user.click(screen.getByRole('button', { name: /Add Option/i }));
    await user.type(screen.getByLabelText(/Add Option/i), 'Option B');
    await user.click(screen.getByRole('button', { name: /Add Option/i }));

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'My New Poll',
      options: ['Option A', 'Option B'],
    });
  });

  test('calls onSubmit with correct data when saving changes to a poll', async () => {
    const user = userEvent.setup();
    const mockPoll = {
      title: 'Existing Poll',
      options: ['Opt1', 'Opt2'],
    };
    render(<PollForm poll={mockPoll} onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByDisplayValue('Existing Poll');
    fireEvent.change(titleInput, { target: { value: 'Updated Poll' } });

    const option1Input = screen.getByDisplayValue('Opt1');
    fireEvent.change(option1Input, { target: { value: 'Updated Opt1' } });

    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Updated Poll',
      options: ['Updated Opt1', 'Opt2'],
    });
  });
});
