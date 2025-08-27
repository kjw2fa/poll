import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MyPolls = ({ userId }) => {
    const [createdPolls, setCreatedPolls] = useState([]);
    const [votedPolls, setVotedPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPolls = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`http://localhost:3001/api/user/${userId}/polls`);
                const data = await response.json();
                setCreatedPolls(data.createdPolls || []);
                setVotedPolls(data.votedPolls || []);
            } catch (error) {
                console.error('Error fetching my polls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPolls();
    }, [userId]);

    if (!userId) return <div>Please log in to view your polls.</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Polls You Created</h2>
            {createdPolls.length === 0 ? <p>No polls created.</p> : (
                <ul>
                    {createdPolls.map(poll => (
                        <li key={poll.id}>
                            <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <h2>Polls You Voted On</h2>
            {votedPolls.length === 0 ? <p>No polls voted on.</p> : (
                <ul>
                    {votedPolls.map(poll => (
                        <li key={poll.id}>
                            <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPolls;