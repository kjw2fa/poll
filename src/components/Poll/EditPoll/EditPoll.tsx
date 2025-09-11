import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import PollSettings from '../../PollSettings/PollSettings.tsx';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { EditPollMutation as EditPollMutationType } from './__generated__/EditPollMutation.graphql';
import { toast } from 'sonner';

const EditPollMutation = graphql`
  mutation EditPollMutation($pollId: ID!, $userId: ID!, $title: String!, $options: [String]!) {
    editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {
      id
      title
      options
    }
  }
`;

const EditPollComponent = ({ userId, poll: initialPoll, onPollUpdated }) => {
    const [poll, setPoll] = useState(initialPoll);
    const { id } = useParams();
    const [commitMutation, isMutationInFlight] = useMutation<EditPollMutationType>(EditPollMutation);

    useEffect(() => {
        setPoll(initialPoll);
    }, [initialPoll]);

    const handleSave = (pollData: any) => {
        commitMutation({
            variables: {
                pollId: id,
                userId,
                ...pollData,
            },
            onCompleted: (response) => {
                toast.success('Poll updated!');
                if (onPollUpdated) {
                    onPollUpdated({ ...poll, ...pollData });
                }
            },
            onError: (error) => {
                toast.error('Failed to update poll.');
            },
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Poll</h1>
            {poll ? (
                <PollSettings poll={poll} onSave={handleSave} isEditing={true} />
            ) : (
                <p>Loading poll...</p>
            )}
        </div>
    );
};

const EditPoll = (props: { userId: string, poll: any, onPollUpdated: any }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <EditPollComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default EditPoll;