import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import Vote from './Vote/Vote.tsx';
import PollResults from './PollResults/PollResults.tsx';
import EditPoll from './EditPoll/EditPoll.tsx';
import PollSearch from './PollSearch/PollSearch.tsx';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollQuery as PollQueryType } from './__generated__/PollQuery.graphql';

const PollQuery = graphql`
  query PollQuery($id: ID!, $userId: ID!) {
    poll(id: $id) {
      id
      title
      options
      creator {
        name
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

const PollComponent = ({ userId }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const data = useLazyLoadQuery<PollQueryType>(
        PollQuery,
        { id, userId },
    );

    const poll = data.poll;
    const canEdit = poll?.permissions?.canEdit;

    const handleSearch = (pollId: string) => {
        navigate(`/poll/${pollId}`);
    };

    const handlePollUpdated = (updatedPoll: any) => {
        // This will be handled by Relay's data management
    };

    if (!id) {
        return <PollSearch onSearch={handleSearch} />;
    }

    return (
        <div className="flex flex-col gap-4">
            {poll && <h2>{poll.title} by {poll.creator.name}</h2>}
            <Tabs defaultValue="vote">
                <TabsList>
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
                <TabsContent value="vote">
                    <Vote userId={userId} poll={poll} />
                </TabsContent>
                <TabsContent value="results">
                    <PollResults />
                </TabsContent>
                {canEdit && (
                    <TabsContent value="edit">
                        <EditPoll userId={userId} poll={poll} onPollUpdated={handlePollUpdated} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
};

const Poll = (props: { userId: string }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <PollComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Poll;
