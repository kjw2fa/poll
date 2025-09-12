import React, { useState } from 'react';
import { useMutation, graphql, useFragment } from 'react-relay';
import { toast } from 'sonner';
import { EditPollMutation as EditPollMutationType } from './__generated__/EditPollMutation.graphql';
import { EditPoll_poll$key } from './__generated__/EditPoll_poll.graphql';

const EditPollMutation = graphql`
  mutation EditPollMutation($pollId: ID!, $userId: ID!, $title: String!, $options: [String!]!) {
    editPoll(pollId: $pollId, userId: $userId, title: $title, options: $options) {
      id
      title
      options
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

const EditPoll = ({ poll: pollProp, userId, onPollUpdated }: { poll: EditPoll_poll$key, userId: string, onPollUpdated: (poll: any) => void }) => {
  const poll = useFragment(EditPoll_poll, pollProp);
  const [title, setTitle] = useState(poll.title);
  const [options, setOptions] = useState(poll.options);
  const [commit, isInFlight] = useMutation<EditPollMutationType>(EditPollMutation);

  const handleUpdate = () => {
    commit({
      variables: {
        pollId: poll.id,
        userId,
        title,
        options,
      },
      onCompleted: (response) => {
        toast.success('Poll updated successfully!');
        if (onPollUpdated) {
          onPollUpdated(response.editPoll);
        }
      },
      onError: (err) => {
        toast.error(err.message || 'Error updating poll.');
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded"
      />
      <div>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="p-2 border rounded mt-2 w-full"
          />
        ))}
      </div>
      <button onClick={handleUpdate} disabled={isInFlight} className="p-2 bg-blue-500 text-white rounded">
        {isInFlight ? 'Updating...' : 'Update Poll'}
      </button>
    </div>
  );
};

export default EditPoll;
