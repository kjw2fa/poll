import React, { useState } from 'react';
import { useMutation, graphql } from 'react-relay';
import { LoginMutation as LoginMutationType } from './__generated__/LoginMutation.graphql';
import { Button } from "../ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";

const LoginMutation = graphql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      userId
      username
    }
  }
`;

const Login = ({ isOpen, onClose, onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [commitMutation, isMutationInFlight] = useMutation<LoginMutationType>(LoginMutation);

  const handleLogin = () => {
    commitMutation({
      variables: {
        username,
        password,
      },
      onCompleted: (response) => {
        if (response.login) {
          const { token, userId, username } = response.login;
          setMessage('Login successful!');
          if (onLogin) onLogin({ token, userId, username });
          onClose();
        } else {
          setMessage('Login failed. Please check your username and password.');
        }
      },
      onError: (error) => {
        setMessage(error.message || 'Login failed.');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Welcome back!</DialogTitle>
          <DialogDescription>Please sign in to your account</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="m@example.com"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isMutationInFlight}>
              Login
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Button variant="link" onClick={onSwitchToSignup} type="button">
                Sign up
              </Button>
            </div>
          </div>
        </form>
        {message && <p>{message}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default Login;
