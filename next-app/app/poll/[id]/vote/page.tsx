'use client';

import Vote from '@/components/Poll/Vote/Vote';
import { Vote_poll$key } from '@/components/Poll/Vote/__generated__/Vote_poll.graphql';

// This component will be rendered by the PollLayout
// The PollLayout will pass the `poll` and `userId` props.
const VotePage = ({ poll, userId }: { poll: Vote_poll$key, userId: string }) => {
    return <Vote poll={poll} userId={userId} />;
};

export default VotePage;