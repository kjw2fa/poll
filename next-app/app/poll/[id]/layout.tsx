'use client';

import React from 'react';
import PageContainer from '@/components/ui/PageContainer';

const PollLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageContainer>
            {children}
        </PageContainer>
    );
};

export default PollLayout;