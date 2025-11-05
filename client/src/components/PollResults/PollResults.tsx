import React from 'react';
import { useFragment, graphql } from 'react-relay';
import { PollResults_results$key } from './__generated__/PollResults_results.graphql';

import { WinningOption } from '../../../generated/graphql';

const PollResults_results = graphql`
  fragment PollResults_results on Poll {
    votes {
        user {
            username
        }
        ratings {
            option {
                optionText
            }
            rating
        }
    }
  }
`;

const PollResults = ({ poll: pollProp }: { poll: PollResults_results$key }) => {
    const poll = useFragment(PollResults_results, pollProp);

    if (!poll) {
        return <div>Loading results...</div>;
    }

    const voters = new Set(poll.votes.map(v => v.user.username));

    const optionRatings: { [key: string]: number[] } = {};
    poll.votes.forEach(vote => {
        vote.ratings.forEach(rating => {
            if (!optionRatings[rating.option.optionText]) {
                optionRatings[rating.option.optionText] = [];
            }
            optionRatings[rating.option.optionText].push(rating.rating);
        });
    });

    const averageRatings: WinningOption[] = Object.entries(optionRatings).map(([option, ratings]) => (({
        option,
        averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length
    })));

    averageRatings.sort((a, b) => b.averageRating - a.averageRating);

    return (
        <div className="poll-results flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Results</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Option</th>
                            <th className="py-2 px-4 border-b">Average Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {averageRatings.map((result, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{result.option}</td>
                                <td className="py-2 px-4 border-b">{result.averageRating.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Voters ({voters.size})</h2>
                {Array.from(voters).length > 0 ? (
                    <ul>
                        {Array.from(voters).map((voter, index) => (
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

export default PollResults;
