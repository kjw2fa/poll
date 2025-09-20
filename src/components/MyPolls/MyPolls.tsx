import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { MyPollsQuery as MyPollsQueryType } from './__generated__/MyPollsQuery.graphql';
import PageContainer from '../ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import PollCard from '../Poll/PollCard/PollCard';
import { PermissionType } from '../../generated/graphql.ts';

const MyPollsQuery = graphql`
  query MyPollsQuery($userId: ID!, $permission: PermissionType!) {
    user(id: $userId) {
      polls(permission: $permission) {
        id
        ...PollCard_poll
      }
      votes {
        poll {
          id
          ...PollCard_poll
        }
      }
    }
  }
`;

const MyPollsComponent = ({ userId }: { userId: string }) => {
  const data = useLazyLoadQuery<MyPollsQueryType>(MyPollsQuery, { userId, permission: PermissionType.EDIT });

  const createdPolls = data.user?.polls || [];
  const votedPolls = data.user?.votes?.map(vote => vote?.poll) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Polls</h1>
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Owned Polls</TabsTrigger>
          <TabsTrigger value="voted">Voted Polls</TabsTrigger>
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
        <TabsContent value="voted">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {votedPolls.length > 0 ? (
              votedPolls.map(poll => (
                poll && <PollCard key={poll.id} poll={poll} userId={userId} />
              ))
            ) : (
              <p>No polls voted on yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MyPolls = ({ userId }: { userId: string }) => {
  return (
    <PageContainer>
      <Suspense fallback={<div>Loading My Polls...</div>}>
        <MyPollsComponent userId={userId} />
      </Suspense>
    </PageContainer>
  );
};

export default MyPolls;