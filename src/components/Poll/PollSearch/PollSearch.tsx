import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "../../ui/input.tsx";
import { Button } from "../../ui/button.tsx";
import PageContainer from '../../ui/PageContainer';

const PollSearch = ({ onSearch }) => {
    const [pollId, setPollId] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (pollId.trim() !== '') {
            if (onSearch) {
                onSearch(pollId);
            }
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
            <div className="poll-search">
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
