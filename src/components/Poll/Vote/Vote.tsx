import React, { useState, useMemo } from 'react';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { useMutation, graphql, useFragment } from 'react-relay';
import { toast } from 'sonner';
import { VoteSubmitVoteMutation as VoteSubmitVoteMutationType } from './__generated__/VoteSubmitVoteMutation.graphql';
import { Vote_poll$key } from './__generated__/Vote_poll.graphql';
import { Draggable, Droppable } from '../../ui/dnd';
import { Badge } from '../../ui/badge';
import { RecordSourceSelectorProxy } from 'relay-runtime';

const VoteSubmitVoteMutation = graphql`
  mutation VoteSubmitVoteMutation($pollId: ID!, $userId: ID!, $ratings: [VoteInput!]!) {
    submitVote(pollId: $pollId, userId: $userId, ratings: $ratings) {
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

const Vote_poll = graphql`
  fragment Vote_poll on Poll {
    id
    options {
      id
      optionText
    }
    votes {
        user {
            id
        }
        ratings {
            option {
                id
            }
            rating
        }
    }
  }
`;

import { PollOption as Option } from '../../../generated/graphql';

const Vote = ({ userId, poll: pollProp }: { userId: string, poll: Vote_poll$key }) => {
    const poll = useFragment(Vote_poll, pollProp);

    const initialRatings = useMemo(() => {
        const previousRatings = new Map<Option, number>();
        const userVote = poll.votes.find(v => v.user.id === userId);
        if (userVote) {
            userVote.ratings.forEach(r => {
                const option = poll.options.find(o => o.id === r.option.id);
                if (option) {
                    previousRatings.set(option, r.rating);
                }
            });
        }
        return previousRatings;
    }, [poll, userId]);

    const [optionRatingMap, setOptionRatingMap] = useState(initialRatings);
    const [commitMutation] = useMutation<VoteSubmitVoteMutationType>(VoteSubmitVoteMutation);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) {
            return;
        }
        const optionId = active.id as string;
        const option = poll.options.find(o => o.id === optionId);

        if (!option) {
            return;
        }

        setOptionRatingMap(prevRatings => {
            const newRatings = new Map(prevRatings);

            if (over) {
                const newRatingValue = parseInt(over.id as string, 10);
                newRatings.set(option, newRatingValue);
            } else {
                newRatings.delete(option);
            }

            return newRatings;
        });
    };

    const handleSubmit = () => {
        const ratingsArray = Array.from(optionRatingMap.entries()).map(([option, rating]) => ({
            optionId: option.id,
            rating
        }));

        commitMutation({
            variables: {
                pollId: poll.id,
                userId,
                ratings: ratingsArray,
            },
            onCompleted: () => {
                toast.success('Votes submitted successfully!');
            },
            onError: (error) => {
                console.error(error);
                toast.error(error.message || 'Error submitting vote.');
            },
            updater: (store: RecordSourceSelectorProxy) => {
                store.invalidateStore();
            },
        });
    };

    if (!poll) {
        return <div>Loading...</div>;
    }

    const draggableOption = (option: Option) =>
        <Draggable key={option.id} id={option.id}>
            <Badge variant="outline">{option.optionText}</Badge>
        </Draggable>;

    const ratings = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const ratedOptions = new Set<Option>(optionRatingMap.keys());

    return (
        <div className="vote">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex justify-center gap-16 max-w-screen-md mx-auto">
                    <div className="w-2/3">
                        <table className="border-collapse border border-gray-300 w-full">
                            <thead>
                                <tr>
                                    <th colSpan={2} className="border border-gray-300 p-2 text-center">Your Ratings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ratings.map(ratingValue => (
                                    <tr key={ratingValue}>
                                        <td className="border border-gray-300 p-2 w-16 text-center">{ratingValue}</td>
                                        <Droppable id={String(ratingValue)}>
                                            {Array.from(optionRatingMap.keys())
                                                .filter(option => optionRatingMap.get(option) === ratingValue)
                                                .map(draggableOption)}
                                        </Droppable>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/3 bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Available Options</h3>
                        {poll.options.filter(option => !ratedOptions.has(option)).map(draggableOption)}
                    </div>
                </div>
            </DndContext>
            <div className="flex justify-center mt-4">
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </div>
        </div>
    );
};

export default Vote;
