import React, { Suspense, useEffect } from 'react';
import PollForm, { PollFormData } from '../PollForm/PollForm';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { CreatePollMutation as CreatePollMutationType } from './__generated__/CreatePollMutation.graphql';
import PageContainer from '../ui/PageContainer';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreatePollMutation = graphql`
  mutation CreatePollMutation($title: String!, $options: [PollOptionInput!]!, $userId: ID!) {
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

const CreatePollComponent = ({ userId }: { userId: string }) => {
    const navigate = useNavigate();
    const [commitMutation] = useMutation<CreatePollMutationType>(CreatePollMutation);

    useEffect(() => {
        if (!userId) {
            navigate('/');
        }
    }, [userId, navigate]);

    const handleSave = (pollData: Omit<PollFormData, 'id'>) => {
        commitMutation({
            variables: {
                title: pollData.title,
                options: pollData.options.map(o => ({ optionText: o.optionText })),
                userId,
            },
            onCompleted: (response) => {
                const pollId = response.createPoll?.pollEdge?.node?.id;
                if (pollId) {
                    toast.success("Poll created successfully!");
                    navigate(`/poll/${pollId}`);
                }
            },
            onError: (error) => {
                console.error('Error creating poll:', error);
                toast.error('Error creating poll.');
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
            <PollForm onSubmit={handleSave} poll={null} />
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
