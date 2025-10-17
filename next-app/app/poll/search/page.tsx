'use client';

import React, { useState, Suspense } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageContainer from '@/components/ui/PageContainer';
import { useLazyLoadQuery } from 'react-relay';
import { pageSearchQuery as PollSearchQueryType } from './__generated__/pageSearchQuery.graphql';
import { PollSearchQuery } from './page.query';
import PollList from '@/components/Poll/PollList/PollList';
import { useAuth } from '@/lib/AuthContext';

const PollSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string | null>(null);

    const handleSearch = async () => {
        setSubmittedSearchTerm(searchTerm);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <PageContainer>
            <div className="poll-search flex flex-col gap-6">
                <h1 className="text-3xl font-bold mb-6">Find a Poll</h1>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a poll title"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
                {submittedSearchTerm && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PollSearchResults searchTerm={submittedSearchTerm} />
                    </Suspense>
                )}
            </div>
        </PageContainer>
    );
};

const PollSearchResults = ({ searchTerm }: { searchTerm: string }) => {
    const data = useLazyLoadQuery<PollSearchQueryType>(PollSearchQuery, { searchTerm });
    const { userId } = useAuth();

    if (!userId) {
        return <div>Please log in to see poll results.</div>
    }

    return <PollList polls={data.searchPolls} userId={userId} />;
}

export default PollSearchPage;
