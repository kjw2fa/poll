import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PollResults.css';

const PollResults = () => {
    const { id } = useParams();
    const [pollResults, setPollResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPollResults = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/polls/${id}/results`);
                if (response.ok) {
                    const data = await response.json();
                    setPollResults(data);
                } else {
                    setError('Failed to fetch poll results');
                }
            } catch (err) {
                setError('Error fetching poll results:' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPollResults();
    }, [id]);

    if (loading) {
        return <div>Loading results...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!pollResults) {
        return <div>No results found for this poll.</div>;
    }

    return (
        <div className="poll-results">
            <h2>Results for: {pollResults.pollTitle}</h2>

            <h3>Winning Option(s):</h3>
            {pollResults.results.length > 0 ? (
                <ul>
                    {pollResults.results.map((result, index) => (
                        <li key={index}>
                            {result.option} (Average Rating: {result.averageRating.toFixed(2)})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No clear winning option yet.</p>
            )}

            <h3>Total Votes: {pollResults.totalVotes}</h3>
            <h3>Voters:</h3>
            {pollResults.voters.length > 0 ? (
                <ul>
                    {pollResults.voters.map((voter, index) => (
                        <li key={index}>
                            <strong>{voter}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No named votes cast yet.</p>
            )}
        </div>
    );
};

export default PollResults;
