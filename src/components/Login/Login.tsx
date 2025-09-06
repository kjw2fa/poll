import React, { useState } from 'react';
import { useMutation, graphql } from 'react-relay';
import { LoginMutation as LoginMutationType } from './__generated__/LoginMutation.graphql';
import { cn } from "../../lib/utils.ts";
import { Button } from "../ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import PageContainer from '../ui/PageContainer';

const LoginMutation = graphql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      userId
      username
    }
  }
`;

const Login = ({ onLogin }) => {
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
        const { token, userId, username } = response.login;
        setMessage('Login successful!');
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        if (onLogin) onLogin({ token, userId, username });
      },
      onError: (error) => {
        setMessage(error.message || 'Login failed.');
      },
    });
  };

  return (
    <PageContainer>
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back!</CardTitle>
            <CardDescription>Please sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
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
                  <div className="grid gap-3">
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
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
