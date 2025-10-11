'use client';

import PollResults from '@/components/Poll/PollResults/PollResults';
import { PollResults_results$key } from '@/components/Poll/PollResults/__generated__/PollResults_results.graphql';

// This component will be rendered by the PollLayout
// The PollLayout will pass the `poll` prop.
const PollResultsPage = ({ poll }: { poll: PollResults_results$key }) => {
    return <PollResults resultsRef={poll} />;
};

export default PollResultsPage;