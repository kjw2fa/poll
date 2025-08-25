import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import MenuBar from './components/MenuBar/MenuBar';
import HomePage from './components/HomePage/HomePage';
import CreatePoll from './components/CreatePoll/CreatePoll';
import Poll from './components/Poll/Poll';
import PollResults from './components/Poll/PollResults/PollResults';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <MenuBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll" element={<Poll />} />
          <Route path="/poll/:id" element={<Poll />} />
          <Route path="/poll/:id/results" element={<PollResults />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
