import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import './Vote.css';

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
    const [options, setOptions] = useState([]);
    const [ratings, setRatings] = useState(Array.from({ length: 10 }, (_, i) => ({ id: `rating-${i + 1}`, options: [] })));
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/polls/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPoll(data);
                    setOptions(data.options.map((option, index) => ({ id: `option-${index}`, text: option })));
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
        const { active, over } = event;

        if (!active.data.current) return;

        const draggedOption = active.data.current.option;
        const optionId = active.id;

        let newRatings = [...ratings];
        let newOptions = [...options];

        // Determine if the dragged item was originally from the options list or a rating cell
        const isFromOptionsList = newOptions.some(opt => opt.id === optionId);

        // Remove from original location
        if (isFromOptionsList) {
            newOptions = newOptions.filter(opt => opt.id !== optionId);
        } else {
            // It was from a rating cell, remove it from there
            newRatings = newRatings.map(r => ({
                ...r,
                options: r.options.filter(opt => opt.id !== optionId)
            }));
        }

        // Add to new location
        if (over && over.id.startsWith('rating-')) {
            // Dropped into a rating cell
            const ratingId = over.id;
            newRatings = newRatings.map(r =>
                r.id === ratingId ? { ...r, options: [...r.options, draggedOption] } : r
            );
        } else {
            // Dropped outside any droppable area, or back to the options container
            newOptions = [...newOptions, draggedOption];
        }

        setRatings(newRatings);
        setOptions(newOptions);
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
                        {options.map(option => (
                            <Draggable key={option.id} id={option.id} data={{ option }}>
                                <div className="option-item">{option.text}</div>
                            </Draggable>
                        ))}
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
                                {ratings.map(rating => (
                                    <tr key={rating.id}>
                                        <td>{11 - parseInt(rating.id.split('-')[1])}</td>
                                        <Droppable id={rating.id}>
                                            {rating.options.map(option => (
                                                <Draggable key={option.id} id={option.id} data={{ option }}>
                                                    <div className="dropped-option">{option.text}</div>
                                                </Draggable>
                                            ))}
                                        </Droppable>
                                    </tr>
                                ))}
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
