'use client';

import React, { useState, useEffect } from 'react';
import MenuBar from './MenuBar.js';
import Login from '@/components/Login/Login.js';
import Signup from '@/components/Signup/Signup.js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthWrapper = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        setLoggedIn(!!token);
        setUsername(storedUsername || '');
    }, []);

    const handleLogin = ({ token, userId, username }: { token: string, userId: string, username: string }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        setLoggedIn(true);
        setUsername(username);
        setIsLoginModalOpen(false);
        router.refresh(); // Refresh the page to update server components
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setLoggedIn(false);
        setUsername('');
        router.push('/');
        router.refresh();
    };

    const handleSignup = () => {
        setIsSignupModalOpen(false);
        toast.success("Account successfully created!");
        // Note: The original app logged the user in after signup.
        // This requires a token to be returned from the signup mutation.
        // Assuming the signup mutation does not return a token, we will just show the login modal.
        setIsLoginModalOpen(true);
    };

    const onSwitchToSignup = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(true);
    };

    const onSwitchToLogin = () => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
    };

    return (
        <>
            <MenuBar
                loggedIn={loggedIn}
                username={username}
                onLogout={handleLogout}
                setIsLoginModalOpen={setIsLoginModalOpen}
                setIsSignupModalOpen={setIsSignupModalOpen}
            />
            <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} onSwitchToSignup={onSwitchToSignup} />
            <Signup isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} onSignupSuccess={handleSignup} onSwitchToLogin={onSwitchToLogin} />
        </>
    );
};

export default AuthWrapper;
