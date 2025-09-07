import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { Link } from 'react-router-dom';
import { MyPollsQuery as MyPollsQueryType } from './__generated__/MyPollsQuery.graphql';
import PageContainer from '../ui/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';

const MyPollsQuery = graphql`
  query MyPollsQuery($userId: ID!) {
    myPolls(userId: $userId) {
      createdPolls {
        id
        title
        options
        canEdit
      }
      votedPolls {
        id
        title
        options
        canEdit
      }
    }
  }
`;

const MyPollsComponent = ({ userId }: { userId: string }) => {
  const data = useLazyLoadQuery<MyPollsQueryType>(MyPollsQuery, { userId });

  const createdPolls = data.myPolls?.createdPolls || [];
  const votedPolls = data.myPolls?.votedPolls || [];

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
                <Card key={poll.id}>
                  <CardHeader>
                    <CardTitle>{poll.title}</CardTitle>
                    <CardDescription>{poll.options?.length} options</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <Link to={`/poll/${poll.id}`}>
                      <Button variant="outline">Vote</Button>
                    </Link>
                    <Link to={`/poll/${poll.id}/results`}>
                      <Button variant="outline">Results</Button>
                    </Link>
                    {poll.canEdit && (
                      <Link to={`/poll/${poll.id}/edit`}>
                        <Button>Edit</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
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
                <Card key={poll.id}>
                  <CardHeader>
                    <CardTitle>{poll.title}</CardTitle>
                    <CardDescription>{poll.options?.length} options</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <Link to={`/poll/${poll.id}`}>
                      <Button variant="outline">Vote</Button>
                    </Link>
                    <Link to={`/poll/${poll.id}/results`}>
                      <Button>Results</Button>
                    </Link>
                  </CardContent>
                </Card>
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
