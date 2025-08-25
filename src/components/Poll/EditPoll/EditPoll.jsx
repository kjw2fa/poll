import React, { useState } from 'react';

const EditPoll = ({ poll, userId, onPollUpdated }) => {
    const [title, setTitle] = useState(poll.title);
    const [options, setOptions] = useState([...poll.options]);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/poll/${poll.id}/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, title, options }),
            });
            if (res.ok) {
                setMessage('Poll updated!');
                onPollUpdated({ ...poll, title, options });
            } else {
                setMessage('Failed to update poll.');
            }
        } catch (err) {
            setMessage('Error updating poll.');
        }
    };

    return (
        <div>
            <h3>Edit Poll</h3>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <ul>
                {options.map((option, idx) => (
                    <li key={idx}>
                        <input
                            value={option}
                            onChange={e => {
                                const newOptions = [...options];
                                newOptions[idx] = e.target.value;
                                setOptions(newOptions);
                            }}
                        />
                    </li>
                ))}
            </ul>
            <button onClick={handleSave}>Save Poll</button>
            {message && <div>{message}</div>}
        </div>
    );
};

export default EditPoll;