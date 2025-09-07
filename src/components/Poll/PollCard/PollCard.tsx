import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';

const PollCard = ({ poll }) => {
  const canEdit = poll.permissions?.canEdit;

  return (
    <Card key={poll.id}>
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.options?.length} options</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Link to={`/poll/${poll.id}/vote`}>
          <Button variant="outline">Vote</Button>
        </Link>
        <Link to={`/poll/${poll.id}/results`}>
          <Button variant="outline">Results</Button>
        </Link>
        {canEdit && (
          <Link to={`/poll/${poll.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default PollCard;
