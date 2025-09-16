import React, { Suspense, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Vote from './Vote/Vote';
import PollResults from './PollResults/PollResults';
import EditPoll from './EditPoll/EditPoll';
import PollSearch from './PollSearch/PollSearch';
import { useLazyLoadQuery, graphql } from 'react-relay';
import { ErrorBoundary } from 'react-error-boundary';
import { PollQuery as PollQueryType } from './__generated__/PollQuery.graphql';
import PageContainer from '../ui/PageContainer';

const PollQuery = graphql`
  query PollQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      permissions {
        permission_type
        target_id
      }
      ...Vote_poll
      ...EditPoll_poll
      ...PollResults_results
    }
  }
`;

const Poll = (props: { userId: string }) => {
    const { id } = useParams();

    return (
        <PageContainer>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    {id ? <PollComponent {...props} id={id} /> : <PollSearch />}
                </Suspense>
            </ErrorBoundary>
        </PageContainer>
    );
};

const PollComponent = ({ userId, id }) => {
    const data = useLazyLoadQuery<PollQueryType>(
        PollQuery,
        { id },
    );
    const navigate = useNavigate();
    const location = useLocation();

    const poll = data.poll;

    useEffect(() => {
        if (poll && !location.pathname.endsWith('vote') && !location.pathname.endsWith('results') && !location.pathname.endsWith('edit')) {
            navigate(`/poll/${id}/vote`);
        }
    }, [poll, id, navigate, location.pathname]);

    if (!poll) {
        return <div>Poll not found</div>;
    }

    const canEdit = poll.permissions?.some(p => p.permission_type === 'EDIT' && p.target_id === userId);
    const activeTab = location.pathname.split('/').pop();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-6 text-center">{poll.title}</h1>
            <Tabs value={activeTab} onValueChange={(value) => navigate(`/poll/${id}/${value}`)}>
                <TabsList className="w-full p-2 rounded-md bg-gray-100">
                    <TabsTrigger value="vote">Vote</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
                </TabsList>
            </Tabs>
            <Routes>
                <Route path="vote" element={<Vote userId={userId} poll={poll} />} />
                <Route path="results" element={<PollResults resultsRef={poll} />} />
                {canEdit && <Route path="edit" element={<EditPoll userId={userId} poll={poll} />} />}
            </Routes>
        </div>
    );
};

export default Poll;
