import React, { useState } from 'react';
import PollSettings from '../PollSettings/PollSettings';

const CreatePoll = ({ userId }) => {
    const [createdPollId, setCreatedPollId] = useState(null);
    const [createdPollUrl, setCreatedPollUrl] = useState(null);

    const handleSave = async (pollData) => {
        try {
            const response = await fetch('http://localhost:3001/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...pollData, userId }),
            });

            if (response.ok) {
                const data = await response.json();
                const pollId = data.id;
                const pollUrl = `${window.location.origin}/poll/${pollId}`;
                setCreatedPollId(pollId);
                setCreatedPollUrl(pollUrl);
            } else {
                console.error('Failed to create poll');
            }
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    return (
        <div className="create-poll">
            <h2>Create a New Poll</h2>
            {!createdPollId ? (
                <PollSettings onSave={handleSave} isEditing={false} />
            ) : (
                <div className="poll-created-success">
                    <h3>Poll Created Successfully!</h3>
                    <p>Poll ID: {createdPollId}</p>
                    <p>Shareable URL: <a href={createdPollUrl} target="_blank" rel="noopener noreferrer">{createdPollUrl}</a></p>
                </div>
            )}
        </div>
    );
};

export default CreatePoll;