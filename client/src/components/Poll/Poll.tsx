import { Navigate } from 'react-router-dom';

// This page will immediately redirect to the poll search page.
const PollPage = () => {
    return <Navigate to="/poll/search" replace />;
};

export default PollPage;
