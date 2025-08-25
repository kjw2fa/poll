import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <h1>Polling Website</h1>
            <div className="header" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                <Link to="/signup">
                    <button>Create Account</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Header;
