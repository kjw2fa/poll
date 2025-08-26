import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PollSearch.css';

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
        <div className="poll-search">
            <input
                type="text"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Poll ID"
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default PollSearch;
