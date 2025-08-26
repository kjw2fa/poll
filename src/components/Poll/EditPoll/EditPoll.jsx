import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PollSettings from '../../PollSettings/PollSettings';

const EditPoll = ({ userId, poll: initialPoll, onPollUpdated }) => {
    const [poll, setPoll] = useState(initialPoll);
    const [message, setMessage] = useState('');
    const { id } = useParams();

    useEffect(() => {
        setPoll(initialPoll);
    }, [initialPoll]);

    const handleSave = async (pollData) => {
        try {
            const res = await fetch(`http://localhost:3001/api/poll/${id}/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...pollData }),
            });
            if (res.ok) {
                setMessage('Poll updated!');
                if (onPollUpdated) {
                    onPollUpdated({ ...poll, ...pollData });
                }
            } else {
                setMessage('Failed to update poll.');
            }
        } catch (err) {
            setMessage('Error updating poll.');
        }
    };

    return (
        <div>
            {poll ? (
                <PollSettings poll={poll} onSave={handleSave} isEditing={true} />
            ) : (
                <p>Loading poll...</p>
            )}
            {message && <div>{message}</div>}
        </div>
    );
};

export default EditPoll;