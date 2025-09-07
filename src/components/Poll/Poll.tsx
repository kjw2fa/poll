import React, { Suspense } from 'react';
import { useParams, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import Vote from './Vote/Vote.tsx';
import PollResults from './PollResults/PollResults.tsx';
import EditPoll from './EditPoll/EditPoll.tsx';
import PollSearch from './PollSearch/PollSearch.tsx';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollQuery as PollQueryType } from './__generated__/PollQuery.graphql';
import PageContainer from '../ui/PageContainer';

const PollQuery = graphql`
  query PollQuery($id: ID!, $userId: ID!) {
    poll(id: $id) {
      id
      title
      options
      creator {
        username
      }
      permissions(userId: $userId) {
        canEdit
      }
      votes(userId: $userId) {
        option
        rating
      }
    }
  }
`;

const Poll = (props: { userId: string }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSearch = (pollId: string) => {
        navigate(`/poll/${pollId}/vote`);
    };

    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    {id ? <PollComponent {...props} id={id} /> : <PollSearch onSearch={handleSearch} />}
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

const PollComponent = ({ userId, id }) => {
    const data = useLazyLoadQuery<PollQueryType>(
        PollQuery,
        { id, userId },
    );
    const navigate = useNavigate();
    const location = useLocation();

    const poll = data.poll;
    const canEdit = poll?.permissions?.canEdit;

    const handlePollUpdated = (updatedPoll: any) => {
        // This will be handled by Relay's data management
    };

    const activeTab = location.pathname.split('/').pop();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6 text-center">{poll.title}</h1>
            <Tabs value={activeTab} onValueChange={(value) => navigate(`/poll/${id}/${value}`)}>
                <TabsList className="w-full p-2 rounded-md bg-gray-100">
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
            </Tabs>
            <Routes>
                <Route path="vote" element={<Vote userId={userId} poll={poll} />} />
                <Route path="results" element={<PollResults pollId={id} />} />
                {canEdit && <Route path="edit" element={<EditPoll userId={userId} poll={poll} onPollUpdated={handlePollUpdated} />} />}
            </Routes>
        </div>
    );
};

export default Poll;
