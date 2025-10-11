'use client';

import EditPoll from '@/components/Poll/EditPoll/EditPoll';
import { EditPoll_poll$key } from '@/components/Poll/EditPoll/__generated__/EditPoll_poll.graphql';

// This component will be rendered by the PollLayout
// The PollLayout will pass the `poll` and `userId` props.
const EditPollPage = ({ poll, userId }: { poll: EditPoll_poll$key, userId: string }) => {
    return <EditPoll poll={poll} userId={userId} />;
};

export default EditPollPage;