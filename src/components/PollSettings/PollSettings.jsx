import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

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
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="new-option">Add Option</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="text" id="new-option" value={newOption} onChange={handleNewOptionChange} onKeyDown={handleKeyDown} />
                    <Button type="button" onClick={handleAddNewOption}>Add Option</Button>
                </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Options</Label>
                {options.map((option, index) => (
                    <div key={index} className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" value={option} onChange={(e) => handleOptionChange(index, e)} />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveOption(index)}>X</Button>
                    </div>
                ))}
            </div>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Poll'}</Button>
        </form>
    );
};

export default PollSettings;
