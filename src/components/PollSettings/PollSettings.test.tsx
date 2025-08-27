import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PollSettings from './PollSettings';

describe('PollSettings component', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form fields for creating a new poll', () => {
    render(<PollSettings onSave={mockOnSave} isEditing={false} />);

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
    render(<PollSettings poll={mockPoll} onSave={mockOnSave} isEditing={true} />);

    expect(screen.getByDisplayValue('Existing Poll')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  test('adds a new option', async () => {
    const user = userEvent.setup();
    render(<PollSettings onSave={mockOnSave} isEditing={false} />);

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
    render(<PollSettings poll={mockPoll} onSave={mockOnSave} isEditing={true} />);

    expect(screen.getByDisplayValue('Opt1')).toBeInTheDocument();
    const removeButton = screen.getAllByRole('button', { name: /X/i })[0]; // Get the first remove button
    await user.click(removeButton);

    expect(screen.queryByDisplayValue('Opt1')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Opt2')).toBeInTheDocument();
  });

  test('calls onSave with correct data when creating a poll', async () => {
    const user = userEvent.setup();
    render(<PollSettings onSave={mockOnSave} isEditing={false} />);

    await user.type(screen.getByLabelText(/Title/i), 'My New Poll');
    await user.type(screen.getByLabelText(/Add Option/i), 'Option A');
    await user.click(screen.getByRole('button', { name: /Add Option/i }));
    await user.type(screen.getByLabelText(/Add Option/i), 'Option B');
    await user.click(screen.getByRole('button', { name: /Add Option/i }));

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'My New Poll',
      options: ['Option A', 'Option B'],
    });
  });

  test('calls onSave with correct data when saving changes to a poll', async () => {
    const user = userEvent.setup();
    const mockPoll = {
      title: 'Existing Poll',
      options: ['Opt1', 'Opt2'],
    };
    render(<PollSettings poll={mockPoll} onSave={mockOnSave} isEditing={true} />);

    const titleInput = screen.getByDisplayValue('Existing Poll');
    fireEvent.change(titleInput, { target: { value: 'Updated Poll' } });

    const option1Input = screen.getByDisplayValue('Opt1');
    fireEvent.change(option1Input, { target: { value: 'Updated Opt1' } });

    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Updated Poll',
      options: ['Updated Opt1', 'Opt2'],
    });
  });

  test('shows alert if less than two options when submitting', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {}); // Mock window.alert

    render(<PollSettings onSave={mockOnSave} isEditing={false} />);

    await user.type(screen.getByLabelText(/Title/i), 'Single Option Poll');
    await user.type(screen.getByLabelText(/Add Option/i), 'Only One');
    await user.click(screen.getByRole('button', { name: /Add Option/i }));

    await user.click(screen.getByRole('button', { name: /Create Poll/i }));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('A poll must have at least two options.');
    expect(mockOnSave).not.toHaveBeenCalled();

    alertSpy.mockRestore(); // Restore original alert
  });
});
