import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PollSearch.css';

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
        <div className="poll-search">
            <h2>Find a Poll</h2>
            <div className="search-container">
                <input type="text" value={pollId} onChange={(e) => setPollId(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter Poll ID" />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default PollSearch;