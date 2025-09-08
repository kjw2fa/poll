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

const PollCard = ({ poll }) => {
  const canEdit = poll.permissions?.canEdit;
  const pollOptions = poll.options;
  const numberOfOptionsToShow = 2;
  const visibleOptions = pollOptions.slice(0, numberOfOptionsToShow);

  return (
    <Card key={poll.id}>
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>TODO: Add poll description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {visibleOptions.map((option, idx) => (
          <Badge key={idx} variant="secondary">
            {option}
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
                    {option}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/poll/${poll.id}/vote`}>
          <Button variant="outline">Vote</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PollCard;
