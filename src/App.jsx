import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import MenuBar from './components/MenuBar/MenuBar';
import HomePage from './components/HomePage/HomePage';
import CreatePoll from './components/CreatePoll/CreatePoll';
import Poll from './components/Poll/Poll';
import EditPoll from './components/Poll/EditPoll/EditPoll';
import PollResults from './components/Poll/PollResults/PollResults';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import MyPolls from './components/MyPolls/MyPolls';
import './index.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    setLoggedIn(!!token);
    setUsername(storedUsername || '');
    setUserId(storedUserId || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoggedIn(false);
    setUsername('');
    setUserId('');
    navigate('/');
  };

  return (
    <div className="App bg-gray-100 p-4">
      <Header
        loggedIn={loggedIn}
        username={username}
        onLogout={handleLogout}
      />
      <MenuBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePoll userId={userId} />} />
        <Route path="/poll" element={<Poll userId={userId} />} />
        <Route path="/poll/:id" element={<Poll userId={userId} />} />
        <Route path="/poll/edit" element={<EditPoll userId={userId} />} />
        <Route path="/poll/:id/edit" element={<EditPoll userId={userId} />} />
        <Route path="/poll/:id/results" element={<PollResults />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypolls" element={<MyPolls userId={userId} />} />
      </Routes>
    </div>
  );
}

export default App;
