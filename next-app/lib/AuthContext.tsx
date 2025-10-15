'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
    userId: string | null;
    isLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
        setLoading(false);
    }, []);

    const isLoggedIn = !!userId;

    return (
        <AuthContext.Provider value={{ userId, isLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
