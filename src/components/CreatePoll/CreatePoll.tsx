import React, { useState, Suspense } from 'react';
import PollSettings from '../PollSettings/PollSettings.tsx';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { CreatePollMutation as CreatePollMutationType } from './__generated__/CreatePollMutation.graphql';
import PageContainer from '../ui/PageContainer';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';

const CreatePollMutation = graphql`
  mutation CreatePollMutation($title: String!, $options: [String]!, $userId: ID!) {
    createPoll(title: $title, options: $options, userId: $userId) {
        pollEdge {
            cursor
            node {
                id
                ...PollCard_poll
            }
        }
    }
  }
`;

const CreatePollComponent = ({ userId }) => {
    const [createdPollId, setCreatedPollId] = useState(null);
    const [createdPollUrl, setCreatedPollUrl] = useState(null);
    const [commitMutation, isMutationInFlight] = useMutation<CreatePollMutationType>(CreatePollMutation);

    const handleSave = (pollData: any) => {
        commitMutation({
            variables: {
                ...pollData,
                userId,
            },
            onCompleted: (response) => {
                const pollId = response.createPoll.pollEdge.node.id;
                const pollUrl = `${window.location.origin}/poll/${pollId}`;
                setCreatedPollId(pollId);
                setCreatedPollUrl(pollUrl);
            },
            onError: (error) => {
                console.error('Error creating poll:', error);
            },
            updater: (store: RecordSourceSelectorProxy) => {
                const payload = store.getRootField('createPoll');
                const newEdge = payload.getLinkedRecord('pollEdge');
                if (!newEdge) {
                    return;
                }
                const myPolls = store.get(ROOT_ID)?.getLinkedRecord('myPolls', { userId });
                if (myPolls) {
                    const conn = ConnectionHandler.getConnection(myPolls, 'MyPolls_createdPolls');
                    if (conn) {
                        ConnectionHandler.insertEdgeAfter(conn, newEdge);
                    }
                }
            },
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
            {!createdPollId ? (
                <PollSettings onSave={handleSave} isEditing={false} />
            ) : (
                <div className="poll-created-success flex flex-col gap-2">
                    <h3>Poll Created Successfully!</h3>
                    <p>Poll ID: {createdPollId}</p>
                    <p>Shareable URL: <a href={createdPollUrl} target="_blank" rel="noopener noreferrer">{createdPollUrl}</a></p>
                </div>
            )}
        </div>
    );
};

const CreatePoll = (props: { userId: string }) => {
    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <CreatePollComponent {...props} />
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

export default CreatePoll;