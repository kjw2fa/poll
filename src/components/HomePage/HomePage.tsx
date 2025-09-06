import React from 'react';
import PageContainer from '../ui/PageContainer';

const HomePage = () => {
    return (
        <PageContainer>
            <div className="flex flex-col gap-4">
                <h2>Welcome to Poll Everything!</h2>
                <p>This is a place where you can create and participate in polls.</p>
                <p>Create your own poll, share it with others, and see the results in real-time.</p>
            </div>
        </PageContainer>
    );
};

export default HomePage;
