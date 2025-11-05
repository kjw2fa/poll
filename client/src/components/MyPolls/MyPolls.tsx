'use client';

import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { MyPollsPageQuery as MyPollsQueryType } from './__generated__/MyPollsPageQuery.graphql';
import PageContainer from '@/components/ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionType } from '@shared/schema.js';
import { useAuth } from '@/AuthContext.js';
import LoginRequired from '@/components/ui/LoginRequired';
import PollList from '@/components/Poll/PollList/PollList.js';

const MyPollsPageQuery = graphql`
  query MyPollsPageQuery($userId: ID!, $permission: PermissionType!) {
    user(id: $userId) {
      polls(permission: $permission) {
        ...PollList_polls
      }
    }
  }
`;

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
          <PollList polls={createdPolls} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MyPollsPage = () => {
    const { userId, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userId) {
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
