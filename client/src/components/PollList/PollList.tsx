'use client';

import React from 'react';
import PollCard from '@/components/Poll/PollCard/PollCard.js';
import { graphql, useFragment } from 'react-relay';
import { PollList_polls$key } from './__generated__/PollList_polls.graphql';

const PollList_polls = graphql`
  fragment PollList_polls on Poll @relay(plural: true) {
    id
    ...PollCard_poll
  }
`;

const PollList = ({ polls, userId }: { polls: PollList_polls$key, userId: string }) => {
  const data = useFragment(PollList_polls, polls);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.length > 0 ? (
        data.map(poll => (
          poll && <PollCard key={poll.id} poll={poll} userId={userId} />
        ))
      ) : (
        <p>No polls found.</p>
      )}
    </div>
  );
};

export default PollList;
