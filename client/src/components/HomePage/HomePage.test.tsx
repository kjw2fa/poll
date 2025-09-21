import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage component', () => {
  test('renders welcome message and description', () => {
    render(<HomePage />);

    expect(screen.getByText(/Welcome to Poll Everything!/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a place where you can create and participate in polls./i)).toBeInTheDocument();
    expect(screen.getByText(/Create your own poll, share it with others, and see the results in real-time./i)).toBeInTheDocument();
  });
});
