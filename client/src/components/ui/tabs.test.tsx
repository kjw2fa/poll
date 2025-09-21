import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs component', () => {
  test('renders tabs and content correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="content1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2" data-testid="content2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: /Tab 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Tab 2/i })).toBeInTheDocument();

    // Check if default content is visible (active)
    const content1 = screen.getByTestId('content1');
    const content2 = screen.getByTestId('content2');

    expect(content1).toBeInTheDocument();
    expect(content1).toHaveAttribute('data-state', 'active');
    expect(content2).toBeInTheDocument();
    expect(content2).toHaveAttribute('data-state', 'inactive');
  });

  test('switches content when a tab is clicked', async () => { // Added async
    const user = userEvent.setup(); // Setup userEvent
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="content1">Content for Tab 1</TabsContent>
        <TabsContent value="tab2" data-testid="content2">Content for Tab 2</TabsContent>
      </Tabs>
    );

    // Click on Tab 2
    await user.click(screen.getByRole('tab', { name: /Tab 2/i })); // Use user.click

    // Wait for the state to update and re-render
    await waitFor(() => { // Added waitFor
      const content1 = screen.getByTestId('content1');
      const content2 = screen.getByTestId('content2');

      // Check if Tab 2 content is visible (active) and Tab 1 content is hidden (inactive)
      expect(content1).toBeInTheDocument();
      expect(content1).toHaveAttribute('data-state', 'inactive');
      expect(content2).toBeInTheDocument();
      expect(content2).toHaveAttribute('data-state', 'active');
    });
  });

  test('renders with custom className', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1" className="custom-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content">Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole('tablist').closest('.custom-tabs')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toHaveClass('custom-list');
    expect(screen.getByRole('tab', { name: /Tab 1/i })).toHaveClass('custom-trigger');
    expect(screen.getByText('Content')).toHaveClass('custom-content');
  });
});