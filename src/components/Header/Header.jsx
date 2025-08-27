import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ loggedIn, username, onLogout }) => {
    return (
        <div className="header">
            <h1>Polling Website</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                {loggedIn ? (
                    <>
                        <span>Welcome, {username}</span>
                        <button onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/signup">
                            <button>Create Account</button>
                        </Link>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
