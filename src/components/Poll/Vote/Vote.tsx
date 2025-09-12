import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { useMutation, graphql, useFragment } from 'react-relay';
import { toast } from 'sonner';
import { VoteSubmitVoteMutation as VoteSubmitVoteMutationType } from './__generated__/VoteSubmitVoteMutation.graphql';
import { Vote_poll$key } from './__generated__/Vote_poll.graphql';
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler } from 'relay-runtime';
import { Draggable, Droppable } from '../../ui/dnd';

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

const Vote_poll = graphql`
  fragment Vote_poll on Poll @argumentDefinitions(userId: {type: "ID!"}) {
    options
    votes(userId: $userId) {
      option
      rating
    }
  }
`;

const Vote = ({ userId, poll: pollProp }: { userId: string, poll: Vote_poll$key }) => {
    const { id } = useParams<{ id: string }>();
    const poll = useFragment(Vote_poll, pollProp);
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

export default Vote;
