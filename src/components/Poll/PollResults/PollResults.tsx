import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollResultsQuery as PollResultsQueryType } from './__generated__/PollResultsQuery.graphql';

const PollResultsQuery = graphql`
  query PollResultsQuery($pollId: ID!) {
    pollResults(pollId: $pollId) {
      pollTitle
      totalVotes
      voters
      results {
        option
        averageRating
      }
      allAverageRatings {
        option
        averageRating
      }
    }
  }
`;

const PollResultsComponent = ({ pollId }) => {
    const data = useLazyLoadQuery<PollResultsQueryType>(
        PollResultsQuery,
        { pollId },
    );

    if (!data || !data.pollResults) {
        return <div>Loading results...</div>;
    }

    const { pollResults } = data;

    return (
        <div className="poll-results">
            <h3>Winning Option(s):</h3>
            {pollResults.results.length > 0 ? (
                <ul>
                    {pollResults.results.map((result, index) => (
                        <li key={index}>
                            {result.option} (Average Rating: {result.averageRating.toFixed(2)})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No clear winning option yet.</p>
            )}

            <h3>Total Votes: {pollResults.totalVotes}</h3>
            <h3>Voters:</h3>
            {pollResults.voters.length > 0 ? (
                <ul>
                    {pollResults.voters.map((voter, index) => (
                        <li key={index}>
                            <strong>{voter}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No named votes cast yet.</p>
            )}
        </div>
    );
};

const PollResults = ({ pollId }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <PollResultsComponent pollId={pollId} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default PollResults;