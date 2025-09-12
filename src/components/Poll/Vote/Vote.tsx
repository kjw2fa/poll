import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { VoteSubmitVoteMutation as VoteSubmitVoteMutationType } from './__generated__/VoteSubmitVoteMutation.graphql';
import PageContainer from '../../ui/PageContainer';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';

const VoteSubmitVoteMutation = graphql`
  mutation VoteSubmitVoteMutation($pollId: ID!, $userId: ID!, $ratings: [RatingInput!]!) {
    submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {
        pollEdge {
            cursor
            node {
                id
                ...PollCard_poll
                votes(userId: $userId) {
                    option
                    rating
                }
            }
        }
    }
  }
`;

const Draggable = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : {};

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const Droppable = ({ id, children }: { id: number, children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#f0f0f0' : undefined,
    };

    return (
        <td ref={setNodeRef} style={style} className="border border-gray-300 p-2">
            {children}
        </td>
    );
};

const VoteComponent = ({ userId, poll }: { userId: string, poll: any }) => {
    const { id } = useParams<{ id: string }>();
    const [optionRatingMap, setOptionRatingMap] = useState(new Map<string, number>());
    const [commitMutation, isMutationInFlight] = useMutation<VoteSubmitVoteMutationType>(VoteSubmitVoteMutation);

    useEffect(() => {
        if (poll && poll.votes) {
            const previousRatings = new Map<string, number>();
            poll.votes.forEach(({ option, rating }: { option: string, rating: number }) => {
                previousRatings.set(option, rating);
            });
            setOptionRatingMap(previousRatings);
        }
    }, [poll]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const option = active.id as string;

        setOptionRatingMap(prevRatings => {
            const newRatings = new Map(prevRatings);

            if (over) {
                const newRatingValue = over.id as number;
                newRatings.set(option, newRatingValue);
            } else {
                newRatings.delete(option);
            }

            return newRatings;
        });
    };

    const handleSubmit = () => {
        const ratingsArray = Array.from(optionRatingMap.entries()).map(([option, rating]) => ({ option, rating }));

        commitMutation({
            variables: {
                pollId: id,
                userId,
                ratings: ratingsArray,
            },
            onCompleted: () => {
                toast.success('Votes submitted successfully!');
            },
            onError: (error) => {
                toast.error(error.message || 'Error submitting vote.');
            },
            updater: (store: RecordSourceSelectorProxy) => {
                const payload = store.getRootField('submitVote');
                const newEdge = payload.getLinkedRecord('pollEdge');
                if (!newEdge) {
                    return;
                }
                const myPolls = store.get(ROOT_ID)?.getLinkedRecord('myPolls', { userId });
                if (myPolls) {
                    const conn = ConnectionHandler.getConnection(myPolls, 'MyPolls_votedPolls');
                    if (conn) {
                        ConnectionHandler.insertEdgeAfter(conn, newEdge);
                    }
                }
            },
        });
    };

    if (!poll) {
        return <div>Loading...</div>;
    }

    const ratingOptionsMap = new Map<number, Set<string>>();
    for (let i = 1; i <= 10; i++) {
        ratingOptionsMap.set(i, new Set());
    }
    for (const [option, rating] of optionRatingMap.entries()) {
        const options = ratingOptionsMap.get(rating);
        if (options) {
            options.add(option);
        }
    }

    const draggableOption = (option: string) =>
        <Draggable key={option} id={option}>
            <div className="option">{option}</div>
        </Draggable>;

    const tableBody: React.ReactNode[] = [];
    const sortedRatings = Array.from(ratingOptionsMap.entries()).sort(([a], [b]) => b - a);
    for (const [ratingValue, options] of sortedRatings) {
        tableBody.push(<tr key={ratingValue}>
            <td className="border border-gray-300 p-2 w-16 text-center">{ratingValue}</td>
            <Droppable id={ratingValue}>
                {Array.from(options).map(draggableOption)}
            </Droppable>
        </tr>)
    }

    const options = poll ? new Set<string>(poll.options) : new Set<string>();
    const ratedOptions = new Set<string>(optionRatingMap.keys());
    return (
        <div className="vote">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex justify-center gap-16 max-w-screen-md mx-auto">
                    <div className="w-1/3 bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Available Options</h3>
                        {Array.from(options).filter(option => !ratedOptions.has(option)).map(draggableOption)}
                    </div>
                    <div className="w-2/3">
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr>
                                    <th colSpan={2} className="border border-gray-300 p-2 text-center">Your Ratings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableBody}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DndContext>
            <div className="flex justify-center mt-4">
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </div>
        </div>
    );
};

const Vote = (props: { userId: string, poll: any }) => {
    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <VoteComponent {...props} />
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

export default Vote;