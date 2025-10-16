'use client';

import React, { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { MyPollsPageQuery as MyPollsQueryType } from './__generated__/MyPollsPageQuery.graphql';
import { MyPollsPageQuery } from './MyPollsPage.query';
import PageContainer from '@/components/ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PollCard from '@/components/Poll/PollCard/PollCard';
import { PermissionType } from '@/../shared/generated-types';
import { useAuth } from '@/lib/AuthContext';
import LoginRequired from '@/components/ui/LoginRequired';

const MyPollsComponent = ({ userId }: { userId: string }) => {
  const data = useLazyLoadQuery<MyPollsQueryType>(MyPollsPageQuery, { userId, permission: PermissionType.EDIT });

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
    const { userId, isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn || !userId) {
        return <LoginRequired featureName="view your polls" />;
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
