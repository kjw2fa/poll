import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { useMutation, graphql, useFragment } from 'react-relay';
import { toast } from 'sonner';
import { VoteSubmitVoteMutation as VoteSubmitVoteMutationType } from './__generated__/VoteSubmitVoteMutation.graphql';
import { Vote_poll$key } from './__generated__/Vote_poll.graphql';
import { Draggable, Droppable } from '../../ui/dnd';
import { Badge } from '../../ui/badge';
import { RecordSourceSelectorProxy } from 'relay-runtime';

const VoteSubmitVoteMutation = graphql`
  mutation VoteSubmitVoteMutation($pollId: ID!, $userId: ID!, $ratings: [RatingInput!]!) {
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

const Vote = ({ userId, poll: pollProp }: { userId: string, poll: Vote_poll$key }) => {
    const poll = useFragment(Vote_poll, pollProp);
    const optionMap = useMemo(() => new Map(poll.options.map(o => [o.id, o.optionText])), [poll.options]);

    const initialRatings = useMemo(() => {
        const previousRatings = new Map<string, number>();
        const userVote = poll.votes.find(v => v.user.id === userId);
        if (userVote) {
            userVote.ratings.forEach(r => {
                previousRatings.set(r.option.id, r.rating);
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

        setOptionRatingMap(prevRatings => {
            const newRatings = new Map(prevRatings);

            if (over) {
                const newRatingValue = parseInt(over.id as string, 10);
                newRatings.set(optionId, newRatingValue);
            } else {
                newRatings.delete(optionId);
            }

            return newRatings;
        });
    };

    const handleSubmit = () => {
        const ratingsArray = Array.from(optionRatingMap.entries()).map(([optionId, rating]) => ({
            optionId,
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
                toast.error(error.message || 'Error submitting vote.');
            },
            updater: (store: RecordSourceSelectorProxy) => {
                const pollRecord = store.get(poll.id);
                if (!pollRecord) {
                    return;
                }

                const votes = pollRecord.getLinkedRecords('votes') || [];
                const existingVoteIndex = votes.findIndex(v => v.getLinkedRecord('user')?.getValue('id') === userId);

                const newVoteRecord = store.create(Date.now().toString(), 'Vote');
                const userRecord = store.get(userId);
                if (userRecord) {
                    newVoteRecord.setLinkedRecord(userRecord, 'user');
                }
                const ratings = ratingsArray.map(r => {
                    const ratingRecord = store.create(Date.now().toString() + r.optionId, 'VoteRating');
                    const optionRecord = store.get(r.optionId);
                    if (optionRecord) {
                        ratingRecord.setLinkedRecord(optionRecord, 'option');
                    }
                    ratingRecord.setValue(r.rating, 'rating');
                    return ratingRecord;
                });
                newVoteRecord.setLinkedRecords(ratings, 'ratings');

                if (existingVoteIndex !== -1) {
                    const newVotes = [...votes];
                    newVotes[existingVoteIndex] = newVoteRecord;
                    pollRecord.setLinkedRecords(newVotes, 'votes');
                } else {
                    const newVotes = [...votes, newVoteRecord];
                    pollRecord.setLinkedRecords(newVotes, 'votes');
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
    for (const [optionId, rating] of optionRatingMap.entries()) {
        const options = ratingOptionsMap.get(rating);
        if (options) {
            options.add(optionId);
        }
    }

    const draggableOption = (option: {id: string, optionText: string}) =>
        <Draggable key={option.id} id={option.id}>
            <Badge variant="outline">{optionMap.get(option.id)}</Badge>
        </Draggable>;

    const tableBody: React.ReactNode[] = [];
    const sortedRatings = Array.from(ratingOptionsMap.entries()).sort(([a], [b]) => b - a);
    for (const [ratingValue, options] of sortedRatings) {
        tableBody.push(<tr key={ratingValue}>
            <td className="border border-gray-300 p-2 w-16 text-center">{ratingValue}</td>
            <Droppable id={String(ratingValue)}>
                {Array.from(options).map(optionId => draggableOption(poll.options.find(o => o.id === optionId)!))}
            </Droppable>
        </tr>)
    }

    const ratedOptions = new Set<string>(optionRatingMap.keys());
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
                                {tableBody}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/3 bg-blue-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Available Options</h3>
                        {poll.options.filter(option => !ratedOptions.has(option.id)).map(draggableOption)}
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
