import { redirect } from 'next/navigation';

// This page will immediately redirect to the poll search page.
const PollPage = () => {
    redirect('/poll/search');
};

export default PollPage;
