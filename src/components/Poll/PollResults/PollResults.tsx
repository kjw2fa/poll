import React, { Suspense } from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollResultsQuery as PollResultsQueryType } from './__generated__/PollResultsQuery.graphql';

import { Award } from 'lucide-react';

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

    // Create a set of winning option names
    const winningOptionNames = new Set(pollResults.results.map(r => r.option));

    return (
        <div className="poll-results flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Winning {pollResults.results.length === 1 ? 'Option' : 'Options'}</h2>
                {pollResults.results.length > 0 ? (
                    <ul>
                        {pollResults.results.map((result, index) => (
                            <li key={index} className="flex items-center gap-2 justify-center">
                                <Award className="text-yellow-500" />
                                {result.option}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No clear winning option yet.</p>
                )}
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Voters ({pollResults.totalVotes})</h2>
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