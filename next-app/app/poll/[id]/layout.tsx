'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { layoutQuery as PollQueryType } from './__generated__/layoutQuery.graphql';
import PageContainer from '@/components/ui/PageContainer';

const layoutQuery = graphql`
  query layoutQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      permissions {
        permission_type
        target_id
      }
      ...Vote_poll
      ...EditPoll_poll
      ...PollResults_results
    }
  }
`;

const PollLayout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const id = params.id as string;

    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    {id ? <PollComponent id={id}>{children}</PollComponent> : <div>No poll ID provided</div>}
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

const PollComponent = ({ children, id }: { children: React.ReactNode, id: string }) => {
    const data = useLazyLoadQuery<PollQueryType>(layoutQuery, { id });
    const router = useRouter();
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    const poll = data.poll;

    useEffect(() => {
        if (poll && !pathname.endsWith('vote') && !pathname.endsWith('results') && !pathname.endsWith('edit')) {
            router.replace(`/poll/${id}/vote`);
        }
    }, [poll, id, router, pathname]);

    if (!poll) {
        return <div>Poll not found</div>;
    }

    const canEdit = poll.permissions?.some(p => p.permission_type === 'EDIT' && p.target_id === userId);
    const activeTab = pathname.split('/').pop();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6 text-center">{poll.title}</h1>
            <Tabs value={activeTab} onValueChange={(value) => router.push(`/poll/${id}/${value}`)}>
                <TabsList className="w-full p-2 rounded-md bg-gray-100">
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
            </Tabs>
            {/* The children will be the page content for vote, results, or edit */}
            {React.cloneElement(children as React.ReactElement, { poll, userId })}
        </div>
    );
};

export default PollLayout;
