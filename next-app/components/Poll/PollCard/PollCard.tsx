import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { useFragment, graphql } from 'react-relay';
import { PollCard_poll$key } from './__generated__/PollCard_poll.graphql';

const pollCardFragment = graphql`
  fragment PollCard_poll on Poll {
    id
    title
    options {
      id
      optionText
    }
    permissions {
      permission_type
      target_id
    }
  }
`;

const PollCard = (props: { poll: PollCard_poll$key, userId: string }) => {
  const poll = useFragment(pollCardFragment, props.poll);
  const canEdit = poll.permissions?.some(p => p.permission_type === 'EDIT' && p.target_id === props.userId);

  const pollOptions = poll.options;
  const numberOfOptionsToShow = 2;
  const visibleOptions = pollOptions.slice(0, numberOfOptionsToShow);

  return (
    <Card key={poll.id} className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>TODO: Add poll description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {visibleOptions.map((option, idx) => (
          <Badge key={idx} variant="secondary">
            {option.optionText}
          </Badge>
        ))}
        {pollOptions.length > numberOfOptionsToShow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline">
                See all {pollOptions.length} options
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {pollOptions.map((option, idx) => (
                  <Badge key={idx} variant="secondary">
                    {option.optionText}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </CardContent>
      <div className="flex-grow" /> {/*This pushes the footer to the bottom */}
      <CardFooter >
        <Link to={`/poll/${poll.id}`}>
          <Button variant="outline">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PollCard;
