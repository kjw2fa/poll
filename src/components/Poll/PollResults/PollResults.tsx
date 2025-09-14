import React, { Suspense } from 'react';
import { useFragment, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollResults_results$key } from './__generated__/PollResults_results.graphql';

import { Award } from 'lucide-react';

const PollResults_results = graphql`
  fragment PollResults_results on PollResult {
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
`;

const PollResultsComponent = ({ resultsRef }: { resultsRef: PollResults_results$key }) => {
    const pollResults = useFragment(PollResults_results, resultsRef);

    if (!pollResults) {
        return <div>Loading results...</div>;
    }

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

const PollResults = ({ resultsRef }: { resultsRef: PollResults_results$key }) => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <PollResultsComponent resultsRef={resultsRef} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default PollResults;
