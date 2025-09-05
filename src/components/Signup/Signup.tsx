import React, { useState } from 'react';
import { useMutation, graphql } from 'react-relay';
import { SignupMutation as SignupMutationType } from './__generated__/SignupMutation.graphql';
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Label } from "../ui/label.tsx";

const SignupMutation = graphql`
  mutation SignupMutation($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
    }
  }
`;

const Signup = () => {
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');
    const [commitMutation, isMutationInFlight] = useMutation<SignupMutationType>(SignupMutation);

    const handleSignup = () => {
        commitMutation({
            variables: {
                username: signupUsername,
                email: signupEmail,
                password: signupPassword,
            },
            onCompleted: (response) => {
                setSignupMessage('Signup successful!');
            },
            onError: (error) => {
                setSignupMessage(error.message || 'Signup failed.');
            },
        });
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
            <Button onClick={handleSignup} disabled={isMutationInFlight}>Create Account</Button>
            {signupMessage && <div>{signupMessage}</div>}
        </div>
    );
};

export default Signup;
