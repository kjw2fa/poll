import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from 'sonner';

export type PollFormData = {
    id?: string;
    title: string;
    options: {
        id: string;
        optionText: string;
    }[];
};

type PollFormProps = {
    poll: PollFormData | null;
    onSubmit: (data: Omit<PollFormData, 'id'>) => void;
};

const PollForm = ({ poll, onSubmit }: PollFormProps) => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState<{ id: string; optionText: string }[]>([]);
    const [newOption, setNewOption] = useState('');

    useEffect(() => {
        if (poll) {
            setTitle(poll.title);
            setOptions(poll.options);
        }
    }, [poll]);

    const handleNewOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOption(event.target.value);
    };

    const handleAddNewOption = () => {
        if (newOption.trim() !== '' && options.length < 100) {
            setOptions([...options, { id: '', optionText: newOption.trim() }]);
            setNewOption('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddNewOption();
        }
    };

    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], optionText: event.target.value };
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (options.length < 2) {
            toast.error('A poll must have at least two options.');
            return;
        }
        onSubmit({ title, options });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="new-option">Add Option</Label>
                <div className="flex w-full items-center space-x-2">
                    <Input type="text" id="new-option" value={newOption} onChange={handleNewOptionChange} onKeyDown={handleKeyDown} className="w-full" />
                    <Button type="button" onClick={handleAddNewOption}>Add Option</Button>
                </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label>Options</Label>
                {options.length === 0 ? (
                    <p className="text-muted-foreground">No options added yet. Add some options above.</p>
                ) : (
                    options.map((option, index) => (
                        <div key={index} className="flex w-full items-center space-x-2">
                            <Input type="text" value={option.optionText} onChange={(e) => handleOptionChange(index, e)} readOnly={!!option.id} />
                            <Button type="button" variant="destructive" onClick={() => handleRemoveOption(index)}>X</Button>
                        </div>
                    ))
                )}
            </div>
            <Button type="submit">{poll ? 'Save Changes' : 'Create Poll'}</Button>
        </form>
    );
};

export default PollForm;
