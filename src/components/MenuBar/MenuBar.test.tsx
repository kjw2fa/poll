import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MenuBar from './MenuBar';

describe('MenuBar component', () => {
  test('renders all menu links', () => {
    render(
      <BrowserRouter>
        <MenuBar />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create Poll/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Polls/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /My Polls/i })).toBeInTheDocument();
  });

  test('links have correct href attributes', () => {
    render(
      <BrowserRouter>
        <MenuBar />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Create Poll/i })).toHaveAttribute('href', '/create');
    expect(screen.getByRole('link', { name: /View Polls/i })).toHaveAttribute('href', '/poll');
    expect(screen.getByRole('link', { name: /My Polls/i })).toHaveAttribute('href', '/mypolls');
  });
});
