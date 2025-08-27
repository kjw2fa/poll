import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { OrderedMap } from "js-sdsl"; // Import OrderedMap

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

const Vote = ({ userId }) => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [pollId, setPollId] = useState('');
    const [poll, setPoll] = useState(null);
    const [message, setMessage] = useState('');
    const [ratingsToOptions, setRatingsToOptions] = useState(initialDescendingMap(10));

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/polls/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPoll(data);

                    if (userId) {
                        // Check if user has voted
                        const voteRes = await fetch(`http://3001/api/poll/${id}/vote?userId=${userId}`);
                        if (voteRes.ok) {
                            const voteData = await voteRes.json();
                            const previousRatingsToOptions = initialDescendingMap(10);
                            Object.entries(voteData.ratings).forEach(([option, rating]) => {
                                // Use getElementByKey to get the Set, then add
                                previousRatingsToOptions.getElementByKey(rating).value.add(option);
                            });
                            setRatingsToOptions(previousRatingsToOptions);
                        }
                    }
                } else {
                    console.error('Failed to fetch poll');
                }
            } catch (error) {
                console.error('Error fetching poll:', error);
            }
        };

        fetchPoll();
    }, [id, userId]);

    const handleDragEnd = (event) => {
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

    const handleSubmit = async () => {
        const userName = localStorage.getItem('username') || 'Anonymous';
        // Flatten ratingsToOptions map of [{ option, rating }, ...]
        const ratingsArray = [];
        // Iterate using forEach, which provides key and value
        ratingsToOptions.forEach((ratingValue, options) => {
            options.forEach(option => {
                ratingsArray.push({ option, rating: ratingValue });
            });
        });
        await fetch('http://localhost:3001/api/votes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pollId: id,
                userId,
                userName,
                ratings: ratingsArray
            }),
        });
        alert('Votes submitted successfully!');
    };

    if (!poll) {
        return <div>Loading...</div>;
    }

    const draggableOption = option =>
        <Draggable key={option} id={option} data={{ option }}>
            <div className="option">{option}</div>
        </Draggable>;

    const tableBody = [];
    // Iterate using forEach, which provides key and value
    ratingsToOptions.forEach((ratingValue, options) => {
        tableBody.push(<tr key={ratingValue}>
            <td>{ratingValue}</td>
            <Droppable id={ratingValue}>
                {options.map(draggableOption)}
            </Droppable>
        </tr>)
    });

    const options = poll ? new Set(poll.options) : new Set();
    // Use toArray() to convert OrderedMap to an array for flatMap
    const ratedOptions = new Set(ratingsToOptions.toArray().flatMap(entry => Array.from(entry[1])));
    return (
        <div className="vote">
            <h2>{poll.title}</h2>
            <div className="form-group">
                <label>Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="vote-container">
                    <div className="options-container">
                        <h3>Options</h3>
                        {options.filter(option => !ratedOptions.has(option)).map(draggableOption)}
                    </div>
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
                </div>
            </DndContext>
            <button onClick={handleSubmit}>Submit</button>
            <Link to={`/poll/${id}/results`}>
                <button>View Results</button>
            </Link>
        </div>
    );
};

export default Vote;