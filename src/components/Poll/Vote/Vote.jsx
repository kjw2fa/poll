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

const Vote = () => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [name, setName] = useState('');
    var initialRatingsMap = new SortedMap();
    // Initialize ratings map with keys 1-10 and empty sets.
    for (let i = 10; i >= 1; i--) {
        initialRatingsMap.set(i, new Set());
    }
    const [ratings, setRatings] = useState(initialRatingsMap);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/polls/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPoll(data);
                } else {
                    console.error('Failed to fetch poll');
                }
            } catch (error) {
                console.error('Error fetching poll:', error);
            }
        };

        fetchPoll();
    }, [id]);

    const handleDragEnd = (event) => {
        // "active" is the item being dragged.
        // "over" is the droppable area it is dropped over.
        const { active, over } = event;
        const option = active.id;

        let newRatings = new SortedMap(ratings);

        // Remove the option from any previous rating it was in.
        newRatings.forEach((options) => options.delete(option));

        // If it was dropped over a rating cell, add it to that rating's options.
        if (over) {
            const newRatingValue = over.id;
            newRatings.get(newRatingValue).add(option);
        }

        setRatings(newRatings);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pollId: id, name, ratings }),
            });

            if (response.ok) {
                alert('Votes submitted successfully!');
            } else {
                console.error('Failed to submit votes');
            }
        } catch (error) {
            console.error('Error submitting votes:', error);
        }
    };

    if (!poll) {
        return <div>Loading...</div>;
    }


    const draggableOption = option =>
        <Draggable key={option} id={option} data={{ option }}>
            <div className="option">{option}</div>
        </Draggable>;

    const tableBody = [];
    ratings.forEach((options, ratingValue) => {
        tableBody.push(<tr key={ratingValue}>
            <td>{ratingValue}</td>
            <Droppable id={ratingValue}>
                {options.map(draggableOption)}
            </Droppable>
        </tr>)
    });

    const options = poll ? new Set(poll.options) : new Set();
    const ratedOptions = new Set(ratings.values().flatMap(set => Array.from(set)));
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
