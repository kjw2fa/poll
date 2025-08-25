import React from 'react';
import { useParams } from 'react-router-dom';
import Vote from './Vote/Vote';
import PollSearch from './PollSearch/PollSearch';

const Poll = ({ userId }) => {
    const { id } = useParams();

    return id ? <Vote userId={userId} /> : <PollSearch />;
};

export default Poll;
