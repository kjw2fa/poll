'use client';

import React, { Suspense, useEffect, useState } from 'react';
import PollForm, { PollFormData } from '@/components/PollForm/PollForm';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { pageMutation as CreatePollMutationType } from './__generated__/pageMutation.graphql';
import PageContainer from '@/components/ui/PageContainer';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const pageMutation = graphql`
  mutation pageMutation($title: String!, $options: [PollOptionInput!]!, $userId: ID!) {
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
    const [commitMutation] = useMutation<CreatePollMutationType>(pageMutation);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            router.push('/');
        }
        else {
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
                // Invalidate the entire store to ensure all queries are refetched.
                // This will ensure the new poll appears in the list of polls.
                store.invalidateStore();
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
