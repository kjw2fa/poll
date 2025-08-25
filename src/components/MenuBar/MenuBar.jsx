import React from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';

const MenuBar = () => {
    return (
        <div className="menu-bar">
            <Link to="/">Home</Link>
            <Link to="/create">Create Poll</Link>
            <Link to="/poll">View Polls</Link>
            <Link to="/mypolls">My Polls</Link>
        </div>
    );
};

export default MenuBar;
