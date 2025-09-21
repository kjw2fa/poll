import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import Header from './components/Header/Header.tsx';
import MenuBar from './components/MenuBar/MenuBar.tsx';
import HomePage from './components/HomePage/HomePage.tsx';
import CreatePoll from './components/CreatePoll/CreatePoll.tsx';
import Poll from './components/Poll/Poll.tsx';
import EditPoll from './components/Poll/EditPoll/EditPoll.tsx';
import PollResults from './components/Poll/PollResults/PollResults.tsx';
import Signup from './components/Signup/Signup.tsx';
import Login from './components/Login/Login.tsx';
import MyPolls from './components/MyPolls/MyPolls.tsx';
import './index.css';



import { Toaster, toast } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    setLoggedIn(!!token);
    setUsername(storedUsername || '');
    setUserId(storedUserId || '');
  }, []);

  const handleLogin = ({ token, userId, username }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setLoggedIn(true);
    setUsername(username);
    setUserId(userId);
    setIsLoginModalOpen(false);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoggedIn(false);
    setUsername('');
    setUserId('');
    navigate('/');
  };

  const handleSignup = ({ userId, username }) => {
    setIsSignupModalOpen(false);
    toast.success("Account successfully created!");
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setLoggedIn(true);
    setUsername(username);
    setUserId(userId);
    navigate('/');
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
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <TooltipProvider>
        <div className="App">
          <Toaster />
          <MenuBar
            loggedIn={loggedIn}
            username={username}
            onLogout={handleLogout}
            setIsLoginModalOpen={setIsLoginModalOpen}
            setIsSignupModalOpen={setIsSignupModalOpen}
          />
          <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} onSwitchToSignup={onSwitchToSignup} />
          <Signup isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} onSignupSuccess={handleSignup} onSwitchToLogin={onSwitchToLogin} />
          <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {loggedIn && <Route path="/create" element={<CreatePoll userId={userId} />} />}
              <Route path="/poll" element={<Poll userId={userId} />} />
              <Route path="/poll/:id/*" element={<Poll userId={userId} />} />
              <Route path="/poll/edit" element={<EditPoll userId={userId} />} />
              <Route path="/mypolls" element={<MyPolls userId={userId} />} />
            </Routes>
          </main>
        </div>
      </TooltipProvider>
    </RelayEnvironmentProvider>
  );
}

export default App;
