'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyLoadQuery } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollPageQuery as PollPageQueryType } from './__generated__/PollPageQuery.graphql';
import { PollPageQuery } from './PollPage.query';
import Vote from '@/components/Poll/Vote/Vote';
import PollResults from '@/components/Poll/PollResults/PollResults';
import EditPoll from '@/components/Poll/EditPoll/EditPoll';

const PollPage = () => {
    const params = useParams();
    const id = params.id as string;

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                {id ? <PollComponent id={id} /> : <div>No poll ID provided</div>}
            </Suspense>
        </ErrorBoundary>
    );
};

const PollComponent = ({ id }: { id: string }) => {
    const data = useLazyLoadQuery<PollPageQueryType>(PollPageQuery, { id });
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'vote';
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    const poll = data.poll;

    if (!poll) {
        return <div>Poll not found</div>;
    }

    const canEdit = poll.permissions?.some(p => p.permission_type === 'EDIT' && p.target_id === userId);

    const handleTabChange = (value: string) => {
        router.push(`/poll/${id}?tab=${value}`);
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6 text-center">{poll.title}</h1>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="w-full p-2 rounded-md bg-gray-100">
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
            </Tabs>
            
            {activeTab === 'vote' && <Vote poll={poll} userId={userId} />}
            {activeTab === 'results' && <PollResults poll={poll} />}
            {activeTab === 'edit' && canEdit && <EditPoll poll={poll} userId={userId} />}
        </div>
    );
};

export default PollPage;