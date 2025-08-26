import React, { useState, useEffect } from 'react';
import './PollSettings.css';

const PollSettings = ({ poll, onSave, isEditing }) => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState('');

    useEffect(() => {
        if (isEditing && poll) {
            setTitle(poll.title);
            setOptions(poll.options);
        }
    }, [isEditing, poll]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (options.length < 2) {
            alert('A poll must have at least two options.');
            return;
        }
        onSave({ title, options });
    };

    return (
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
            <button type="submit">{isEditing ? 'Save Changes' : 'Create Poll'}</button>
        </form>
    );
};

export default PollSettings;
