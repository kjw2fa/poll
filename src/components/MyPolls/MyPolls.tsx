import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { MyPollsQuery as MyPollsQueryType } from './__generated__/MyPollsQuery.graphql';
import PageContainer from '../ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import PollCard from '../Poll/PollCard/PollCard';

const MyPollsQuery = graphql`
  query MyPollsQuery($userId: ID!, $count: Int = 10, $cursor: String) {
    myPolls(userId: $userId) {
      createdPolls(first: $count, after: $cursor) @connection(key: "MyPolls_createdPolls") {
        edges {
          node {
            id
            ...PollCard_poll
          }
        }
      }
      votedPolls(first: $count, after: $cursor) @connection(key: "MyPolls_votedPolls") {
        edges {
          node {
            id
            ...PollCard_poll
          }
        }
      }
    }
  }
`;

const MyPollsComponent = ({ userId }: { userId: string }) => {
  const data = useLazyLoadQuery<MyPollsQueryType>(MyPollsQuery, { userId });

  const createdPolls = data.myPolls?.createdPolls?.edges?.map(edge => edge.node) || [];
  const votedPolls = data.myPolls?.votedPolls?.edges?.map(edge => edge.node) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Polls</h1>
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Created Polls</TabsTrigger>
          <TabsTrigger value="voted">Voted Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {createdPolls.length > 0 ? (
              createdPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} userId={userId} />
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
                <PollCard key={poll.id} poll={poll} userId={userId} />
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
