import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import Vote from './Vote/Vote.tsx';
import PollResults from './PollResults/PollResults.tsx';
import EditPoll from './EditPoll/EditPoll.tsx';
import PollSearch from './PollSearch/PollSearch.tsx';

const Poll = ({ userId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState(null);
    const [canEdit, setCanEdit] = useState(false);

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
        <div className="flex flex-col gap-4">
            {poll && <h2>{poll.title}</h2>}
            <Tabs defaultValue="vote">
                <TabsList>
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
                <TabsContent value="vote">
                    <Vote userId={userId} />
                </TabsContent>
                <TabsContent value="results">
                    <PollResults />
                </TabsContent>
                {canEdit && (
                    <TabsContent value="edit">
                        <EditPoll userId={userId} poll={poll} onPollUpdated={handlePollUpdated} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
};

export default Poll;
