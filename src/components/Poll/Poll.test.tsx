
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Poll from './Poll';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

// Mock child components
vi.mock('./Vote/Vote', () => ({ default: ({ userId }) => <div>Mock Vote Component for {userId}</div> }));
vi.mock('./PollResults/PollResults', () => ({ default: () => <div>Mock PollResults Component</div> }));
vi.mock('./EditPoll/EditPoll', () => ({ default: ({ userId, poll }) => <div>Mock EditPoll Component for {userId} - {poll?.title}</div> }));
vi.mock('./PollSearch/PollSearch', () => ({ default: ({ onSearch }) => <input placeholder="Enter Poll ID" onChange={(e) => onSearch(e.target.value)} /> }));

describe('Poll component with Relay', () => {
  let environment;

  beforeEach(() => {
    environment = createMockEnvironment();
    vi.clearAllMocks();
  });

  test('renders poll title and tabs', async () => {
    render(
      <RelayEnvironmentProvider environment={environment}>
        <MemoryRouter initialEntries={['/poll/test-poll-id/vote']}>
          <Routes>
            <Route path="/poll/:id/*" element={<Poll userId="test-user-id" />} />
          </Routes>
        </MemoryRouter>
      </RelayEnvironmentProvider>
    );

    environment.mock.resolveMostRecentOperation(operation =>
      MockPayloadGenerator.generate(operation, {
        Poll: () => ({
          id: 'test-poll-id',
          title: 'Test Poll',
          options: ['Option A', 'Option B'],
          permissions: {
            canEdit: true,
          },
        }),
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Poll/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('tab', { name: /Vote/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Results/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Edit/i })).toBeInTheDocument();
  });

  test('renders PollSearch if no id is provided', async () => {
    render(
      <RelayEnvironmentProvider environment={environment}>
        <MemoryRouter initialEntries={['/poll']}>
            <Poll userId="test-user-id" />
        </MemoryRouter>
      </RelayEnvironmentProvider>
    );

    expect(screen.getByPlaceholderText(/Enter Poll ID/i)).toBeInTheDocument();
  });
});
