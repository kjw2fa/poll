import React, { useState } from 'react';

const Signup = () => {
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signupUsername,
                    email: signupEmail,
                    password: signupPassword
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSignupMessage('Signup successful!');
            } else {
                setSignupMessage(data.error || 'Signup failed.');
            }
        } catch (error) {
            setSignupMessage('Error signing up.');
        }
    };

    return (
        <div className="signup-page">
            <h2>Create Account</h2>
            <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={e => setSignupUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Create Account</button>
            {signupMessage && <div>{signupMessage}</div>}
        </div>
    );
};

export default Signup;