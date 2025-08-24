import React, { useState } from 'react';
import './CreatePoll.css';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState('');
    const [createdPollId, setCreatedPollId] = useState(null);
    const [createdPollUrl, setCreatedPollUrl] = useState(null);

    const handleNewOptionChange = (event) => {
        setNewOption(event.target.value);
    };

    const handleAddNewOption = () => {
        if (newOption.trim() !== '' && options.length < 100) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddNewOption();
        }
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (options.length < 2) {
            alert('A poll must have at least two options.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, options }),
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
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Add Option</label>
                        <div className="add-option-container">
                            <input type="text" value={newOption} onChange={handleNewOptionChange} onKeyDown={handleKeyDown} />
                            <button type="button" onClick={handleAddNewOption}>Add Option</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="option">
                                <input type="text" value={option} onChange={(e) => handleOptionChange(index, e)} />
                                <button type="button" onClick={() => handleRemoveOption(index)}>X</button>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Create Poll</button>
                </form>
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