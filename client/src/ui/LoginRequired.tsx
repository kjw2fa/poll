import React from 'react';

const LoginRequired = ({ featureName }: { featureName: string }) => {
    return (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Login Required</h3>
            <p className="text-muted-foreground mt-2">
                You must be logged in to {featureName}.
            </p>
        </div>
    );
};

export default LoginRequired;
