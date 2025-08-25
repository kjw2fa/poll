import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import './Vote.css';
var SortedMap = require("collections/sorted-map");

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

const descendingMapFactory = () => new SortedMap(undefined, undefined, (a, b) => {
    // b - a will return a positive number if b > a, sorting it first.
    return b - a;
});

const initialDescendingMap = (maxRating) => {
    const map = descendingMapFactory();
    for (let i = 1; i <= maxRating; i++) {
        map.set(i, new Set());
    }
    return map;
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
                        const voteRes = await fetch(`http://localhost:3001/api/poll/${id}/vote?userId=${userId}`);
                        if (voteRes.ok) {
                            const voteData = await voteRes.json();
                            const previousRatingsToOptions = initialDescendingMap(10);
                            Object.entries(voteData.ratings).forEach(([option, rating]) => {
                                previousRatingsToOptions.get(rating).add(option);
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

        let newRatingsToOptions = ratingsToOptions.clone();

        // Remove the option from any previous rating it was in.
        newRatingsToOptions.forEach((options) => options.delete(option));

        // If it was dropped over a rating cell, add it to that rating's options.
        if (over) {
            const newRatingValue = over.id;
            newRatingsToOptions.get(newRatingValue).add(option);
        }

        setRatingsToOptions(newRatingsToOptions);
    };

    const handleSubmit = async () => {
        const userName = localStorage.getItem('username') || 'Anonymous';
        // Flatten ratingsToOptions map of [{ option, rating }, ...]
        const ratingsArray = [];
        ratingsToOptions.forEach((options, ratingValue) => {
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
    ratingsToOptions.forEach((options, ratingValue) => {
        tableBody.push(<tr key={ratingValue}>
            <td>{ratingValue}</td>
            <Droppable id={ratingValue}>
                {options.map(draggableOption)}
            </Droppable>
        </tr>)
    });

    const options = poll ? new Set(poll.options) : new Set();
    const ratedOptions = new Set(ratingsToOptions.values().flatMap(set => Array.from(set)));
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
