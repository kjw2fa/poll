'use client';

import React, { Suspense, useEffect, useState } from 'react';
import PollForm, { PollFormData } from '@/components/PollForm/PollForm';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { CreatePollPageMutation as CreatePollMutationType } from '@/components/CreatePoll/__generated__/CreatePollMutation.graphql';
import PageContainer from '@/components/ui/PageContainer';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CreatePollPageMutation = graphql`
  mutation CreatePollPageMutation($title: String!, $options: [PollOptionInput!]!, $userId: ID!) {
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

const CreatePollComponent = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [commitMutation] = useMutation<CreatePollMutationType>(CreatePollPageMutation);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            router.push('/');
        } else {
            setUserId(storedUserId);
        }
    }, [router]);

    const handleSave = (pollData: Omit<PollFormData, 'id'>) => {
        if (!userId) {
            toast.error('You must be logged in to create a poll.');
            return;
        }
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
                    router.push(`/poll/${pollId}`);
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
                if (userId) {
                    const myPolls = store.get(ROOT_ID)?.getLinkedRecord('myPolls', { userId });
                    if (myPolls) {
                        const conn = ConnectionHandler.getConnection(myPolls, 'MyPolls_createdPolls');
                        if (conn) {
                            ConnectionHandler.insertEdgeAfter(conn, newEdge);
                        }
                    }
                }
            },
        });
    };

    if (!userId) {
        return null; // Or a loading spinner
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
            <PollForm onSubmit={handleSave} poll={null} />
        </div>
    );
};

const CreatePollPage = () => {
    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <CreatePollComponent />
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

export default CreatePollPage;
