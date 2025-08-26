import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', data.username);
                if (onLogin) onLogin(data);
            } else {
                setMessage(data.error || 'Login failed.');
            }
        } catch (error) {
            setMessage('Error logging in.');
        }
    };

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <h2>Login</h2>
            <Label htmlFor="username">Username</Label>
            <Input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <Label htmlFor="password">Password</Label>
            <Input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin}>Login</Button>
            {message && <div>{message}</div>}
        </div>
    );
};

export default Login;