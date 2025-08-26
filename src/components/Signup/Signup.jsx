import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

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
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <h2>Create Account</h2>
            <Label htmlFor="username">Username</Label>
            <Input
                type="text"
                id="username"
                placeholder="Username"
                value={signupUsername}
                onChange={e => setSignupUsername(e.target.value)}
            />
            <Label htmlFor="email">Email</Label>
            <Input
                type="email"
                id="email"
                placeholder="Email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
            />
            <Label htmlFor="password">Password</Label>
            <Input
                type="password"
                id="password"
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
            />
            <Button onClick={handleSignup}>Create Account</Button>
            {signupMessage && <div>{signupMessage}</div>}
        </div>
    );
};

export default Signup;