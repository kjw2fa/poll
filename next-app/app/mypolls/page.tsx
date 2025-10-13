'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { pageQuery as MyPollsQueryType } from './__generated__/pageQuery.graphql';
import PageContainer from '@/components/ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PollCard from '@/components/Poll/PollCard/PollCard';
import { PermissionType } from '@/../shared/generated-types';
import { useRouter } from 'next/navigation';

const pageQuery = graphql`
  query pageQuery($userId: ID!, $permission: PermissionType) {
    user(id: $userId) {
      polls(permission: $permission) {
        id
        ...PollCard_poll
      }
    }
  }
`;

const MyPollsComponent = ({ userId }: { userId: string }) => {
  const data = useLazyLoadQuery<MyPollsQueryType>(pageQuery, { userId, permission: PermissionType.EDIT });

  const createdPolls = data.user?.polls || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Polls</h1>
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="created">Owned Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {createdPolls.length > 0 ? (
              createdPolls.map(poll => (
                poll && <PollCard key={poll.id} poll={poll} userId={userId} />
              ))
            ) : (
              <p>No polls created yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MyPollsPage = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            router.push('/');
        } else {
            setUserId(storedUserId);
        }
    }, [router]);

    if (!userId) {
        return null; // Or a loading spinner
    }

  return (
    <PageContainer>
      <Suspense fallback={<div>Loading My Polls...</div>}>
        <MyPollsComponent userId={userId} />
      </Suspense>
    </PageContainer>
  );
};

export default MyPollsPage;
