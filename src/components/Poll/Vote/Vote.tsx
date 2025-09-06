import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useMutation, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { VoteSubmitVoteMutation as VoteSubmitVoteMutationType } from './__generated__/VoteSubmitVoteMutation.graphql';

const VoteSubmitVoteMutation = graphql`
  mutation VoteSubmitVoteMutation($pollId: ID!, $userId: ID!, $ratings: [RatingInput!]!) {
    submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {
      id
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
    const [ratingsToOptions, setRatingsToOptions] = useState(new Map<string, number>());
    const [commitMutation, isMutationInFlight] = useMutation<VoteSubmitVoteMutationType>(VoteSubmitVoteMutation);

    useEffect(() => {
        if (poll && poll.votes) {
            const previousRatings = new Map<string, number>();
            poll.votes.forEach(({ option, rating }: { option: string, rating: number }) => {
                previousRatings.set(option, rating);
            });
            setRatingsToOptions(previousRatings);
        }
    }, [poll]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const option = active.id as string;

        setRatingsToOptions(prevRatings => {
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
        const ratingsArray = Array.from(ratingsToOptions.entries()).map(([option, rating]) => ({ option, rating }));

        commitMutation({
            variables: {
                pollId: id,
                userId,
                ratings: ratingsArray,
            },
            onCompleted: () => {
                alert('Votes submitted successfully!');
            },
            onError: (error) => {
                console.error('Error submitting vote:', error);
            },
        });
    };

    if (!poll) {
        return <div>Loading...</div>;
    }

    const ratingsToOptionsDerived = new Map<number, Set<string>>();
    for (let i = 1; i <= 10; i++) {
        ratingsToOptionsDerived.set(i, new Set());
    }
    for (const [option, rating] of ratingsToOptions.entries()) {
        const options = ratingsToOptionsDerived.get(rating);
        if (options) {
            options.add(option);
        }
    }

    const draggableOption = (option: string) =>
        <Draggable key={option} id={option}>
            <div className="option">{option}</div>
        </Draggable>;

    const tableBody: React.ReactNode[] = [];
    const sortedRatings = Array.from(ratingsToOptionsDerived.entries()).sort(([a], [b]) => b - a);
    for (const [ratingValue, options] of sortedRatings) {
        tableBody.push(<tr key={ratingValue}>
            <td className="border border-gray-300 p-2">{ratingValue}</td>
            <Droppable id={ratingValue}>
                {Array.from(options).map(draggableOption)}
            </Droppable>
        </tr>)
    }

    const options = poll ? new Set<string>(poll.options) : new Set<string>();
    const ratedOptions = new Set<string>(ratingsToOptions.keys());
    return (
        <div className="vote">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="vote-container flex gap-16">
                    <div className="ratings-container">
                        <table className="border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Rating</th>
                                    <th className="border border-gray-300 p-2">Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableBody}
                            </tbody>
                        </table>
                    </div>
                    <div className="options-container">
                        <h3>Options</h3>
                        {Array.from(options).filter(option => !ratedOptions.has(option)).map(draggableOption)}
                    </div>
                </div>
            </DndContext>
            <div className="flex gap-4 mt-4">
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                <Link to={`/poll/${id}/results`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Results</button>
                </Link>
            </div>
        </div>
    );
};

const Vote = (props: { userId: string, poll: any }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <VoteComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default Vote;