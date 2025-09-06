import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { OrderedMap } from "js-sdsl"; // Import OrderedMap
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

const Draggable = ({ id, children }) => {
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

const Droppable = ({ id, children }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#f0f0f0' : undefined,
    };

    return (
        <td ref={setNodeRef} style={style}>
            {children}
        </td>
    );
};

// Custom comparator for descending order
const descendingComparator = (a, b) => b - a;

const initialDescendingMap = (maxRating) => {
    // OrderedMap takes an array of [key, value] pairs and a comparator
    const initialData = [];
    for (let i = 1; i <= maxRating; i++) {
        initialData.push([i, new Set()]);
    }
    return new OrderedMap(initialData, descendingComparator);
}

const VoteComponent = ({ userId, poll }) => {
    const { id } = useParams();
    const [ratingsToOptions, setRatingsToOptions] = useState(initialDescendingMap(10));
    const [commitMutation, isMutationInFlight] = useMutation<VoteSubmitVoteMutationType>(VoteSubmitVoteMutation);

    useEffect(() => {
        if (poll && poll.votes) {
            const previousRatingsToOptions = initialDescendingMap(10);
            poll.votes.forEach(({ option, rating }) => {
                previousRatingsToOptions.getElementByKey(rating).value.add(option);
            });
            setRatingsToOptions(previousRatingsToOptions);
        }
    }, [poll]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const option = active.id;

        // Create a new OrderedMap instance for immutability
        let newRatingsToOptions = new OrderedMap(ratingsToOptions.toArray(), descendingComparator);

        // Remove the option from any previous rating it was in.
        newRatingsToOptions.forEach((key, value) => value.delete(option));

        // If it was dropped over a rating cell, add it to that rating's options.
        if (over) {
            const newRatingValue = over.id;
            // Use getElementByKey to get the Set, then add
            newRatingsToOptions.getElementByKey(newRatingValue).value.add(option);
        }

        setRatingsToOptions(newRatingsToOptions);
    };

    const handleSubmit = () => {
        const ratingsArray: any[] = [];
        ratingsToOptions.forEach((ratingValue, options) => {
            options.forEach(option => {
                ratingsArray.push({ option, rating: ratingValue });
            });
        });

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

    const draggableOption = (option: any) =>
        <Draggable key={option} id={option} data={{ option }}>
            <div className="option">{option}</div>
        </Draggable>;

    const tableBody: any[] = [];
    ratingsToOptions.forEach((ratingValue, options) => {
        tableBody.push(<tr key={ratingValue}>
            <td>{ratingValue}</td>
            <Droppable id={ratingValue}>
                {Array.from(options).map(draggableOption)}
            </Droppable>
        </tr>)
    });

    const options = poll ? new Set(poll.options) : new Set();
    const ratedOptions = new Set([...ratingsToOptions].flatMap(entry => Array.from(entry[1])));
    return (
        <div className="vote">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="vote-container flex gap-16">
                    <div className="ratings-container">
                        <h3>Ratings</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rating</th>
                                    <th>Options</th>
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
                <button onClick={handleSubmit}>Submit</button>
                <Link to={`/poll/${id}/results`}>
                    <button>View Results</button>
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