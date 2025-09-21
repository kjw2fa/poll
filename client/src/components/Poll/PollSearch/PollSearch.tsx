import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "../../ui/input.tsx";
import { Button } from "../../ui/button.tsx";
import PageContainer from '../../ui/PageContainer';

const PollSearch = () => {
    const [pollId, setPollId] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (pollId.trim() !== '') {
            navigate(`/poll/${pollId}`);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <PageContainer>
            <div className="poll-search flex flex-col gap-6">
                <h1 className="text-3xl font-bold mb-6">Find a Poll</h1>
                <Input
                    type="text"
                    value={pollId}
                    onChange={(e) => setPollId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Poll ID"
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>
        </PageContainer>
    );
};

export default PollSearch;
