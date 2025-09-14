import React from 'react';
import { useMutation, graphql, useFragment } from 'react-relay';
import { toast } from 'sonner';
import { EditPollMutation as EditPollMutationType } from './__generated__/EditPollMutation.graphql';
import { EditPoll_poll$key } from './__generated__/EditPoll_poll.graphql';
import PollForm, { PollFormData } from '../../PollForm/PollForm';

const EditPollMutation = graphql`
  mutation EditPollMutation($pollId: ID!, $userId: ID!, $title: String!, $options: [String!]!) {
    editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {
      id
      title
      options
      ...Vote_poll @arguments(userId: $userId)
      results {
        ...PollResults_results
      }
    }
  }
`;

const EditPoll_poll = graphql`
  fragment EditPoll_poll on Poll {
    id
    title
    options
  }
`;

const EditPoll = ({ poll: pollProp, userId }: { poll: EditPoll_poll$key, userId: string }) => {
  const poll = useFragment(EditPoll_poll, pollProp);
  const [commit, isInFlight] = useMutation<EditPollMutationType>(EditPollMutation);

  const handleUpdate = (pollData: Omit<PollFormData, 'id'>) => {
    commit({
      variables: {
        pollId: poll.id,
        userId,
        title: pollData.title,
        options: pollData.options,
      },
      onCompleted: () => {
        toast.success('Poll updated successfully!');
      },
      onError: (err) => {
        toast.error(err.message || 'Error updating poll.');
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <PollForm onSubmit={handleUpdate} poll={poll} />
    </div>
  );
};

export default EditPoll;
