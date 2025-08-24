import React from 'react';
import { useParams } from 'react-router-dom';
import Vote from './Vote/Vote';
import PollSearch from './PollSearch/PollSearch';

const Poll = () => {
    const { id } = useParams();

    return id ? <Vote /> : <PollSearch />;
};

export default Poll;
