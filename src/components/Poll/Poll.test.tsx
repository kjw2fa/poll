
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Poll from './Poll';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';
import { useParams, useNavigate } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

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
    useParams.mockReturnValue({ id: 'test-poll-id' });
    useNavigate.mockReturnValue(vi.fn());

    render(
      <RelayEnvironmentProvider environment={environment}>
        <BrowserRouter>
          <Poll userId="test-user-id" />
        </BrowserRouter>
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
    useParams.mockReturnValue({}); // No ID
    useNavigate.mockReturnValue(vi.fn());

    render(
      <RelayEnvironmentProvider environment={environment}>
        <BrowserRouter>
          <Poll userId="test-user-id" />
        </BrowserRouter>
      </RelayEnvironmentProvider>
    );

    expect(screen.getByPlaceholderText(/Enter Poll ID/i)).toBeInTheDocument();
  });
});
