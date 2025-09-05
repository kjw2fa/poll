import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { MyPollsQuery as MyPollsQueryType } from './__generated__/MyPollsQuery.graphql';

const MyPollsQuery = graphql`
  query MyPollsQuery($userId: ID!) {
    myPolls(userId: $userId) {
      createdPolls {
        id
        title
        creator {
          username
        }
      }
      votedPolls {
        id
        title
        creator {
          username
        }
      }
    }
  }
`;

const MyPollsComponent = ({ userId }) => {
    const data = useLazyLoadQuery<MyPollsQueryType>(
        MyPollsQuery,
        { userId },
    );

    if (!userId) return <div>Please log in to view your polls.</div>;

    const { createdPolls, votedPolls } = data.myPolls;

    return (
        <div>
            <h2>Polls You Created</h2>
            {createdPolls.length === 0 ? <p>No polls created.</p> : (
                <ul>
                    {createdPolls.map(poll => (
                        <li key={poll.id}>
                            <Link to={`/poll/${poll.id}`}>{poll.title}</Link> by {poll.creator.username}
                        </li>
                    ))}
                </ul>
            )}
            <h2>Polls You Voted On</h2>
            {votedPolls.length === 0 ? <p>No polls voted on.</p> : (
                <ul>
                    {votedPolls.map(poll => (
                        <li key={poll.id}>
                            <Link to={`/poll/${poll.id}`}>{poll.title}</Link> by {poll.creator.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const MyPolls = (props: { userId: string }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <MyPollsComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default MyPolls;