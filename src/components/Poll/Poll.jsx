import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Vote from './Vote/Vote';
import PollResults from './PollResults/PollResults';
import EditPoll from './EditPoll/EditPoll';
import PollSearch from './PollSearch/PollSearch';

const Poll = ({ userId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('vote');

    useEffect(() => {
        if (id) {
            const fetchPollData = async () => {
                try {
                    const pollResponse = await fetch(`http://localhost:3001/api/polls/${id}`);
                    if (pollResponse.ok) {
                        const pollData = await pollResponse.json();
                        setPoll(pollData);
                    } else {
                        console.error('Failed to fetch poll');
                    }
                } catch (error) {
                    console.error('Error fetching poll:', error);
                }
            };

            const fetchPermissions = async () => {
                try {
                    const permissionsResponse = await fetch(`http://localhost:3001/api/poll/${id}/permissions?userId=${userId}`);
                    if (permissionsResponse.ok) {
                        const permissionsData = await permissionsResponse.json();
                        setCanEdit(permissionsData.canEdit);
                    } else {
                        console.error('Failed to fetch permissions');
                    }
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            };

            fetchPollData();
            if (userId) {
                fetchPermissions();
            }
        }
    }, [id, userId]);

    const handleSearch = (pollId) => {
        navigate(`/poll/${pollId}`);
    };

    const handlePollUpdated = (updatedPoll) => {
        setPoll(updatedPoll);
    };

    if (!id) {
        return <PollSearch onSearch={handleSearch} />;
    }

    return (
        <div>
            {poll && <h2>{poll.title}</h2>}
            <div className="tab-navigation">
                <button onClick={() => setActiveTab('vote')}>Vote</button>
                <button onClick={() => setActiveTab('results')}>Results</button>
                {canEdit && <button onClick={() => setActiveTab('edit')}>Edit</button>}
            </div>
            <div className="tab-content">
                {activeTab === 'vote' && <Vote userId={userId} />}
                {activeTab === 'results' && <PollResults />}
                {activeTab === 'edit' && canEdit && <EditPoll userId={userId} poll={poll} onPollUpdated={handlePollUpdated} />}
            </div>
        </div>
    );
};

export default Poll;
