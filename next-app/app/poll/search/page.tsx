'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageContainer from '@/components/ui/PageContainer';

const PollSearchPage = () => {
    const [pollId, setPollId] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (pollId.trim() !== '') {
            router.push(`/poll/${pollId}`);
        }
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
                <Input
                    type="text"
                    value={pollId}
                    onChange={(e) => setPollId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Poll ID"
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>
        </PageContainer>
    );
};

export default PollSearchPage;
