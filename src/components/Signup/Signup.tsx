import React, { useState } from 'react';
import { useMutation, graphql } from 'react-relay';
import { SignupMutation as SignupMutationType } from './__generated__/SignupMutation.graphql';
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Label } from "../ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";

const SignupMutation = graphql`
  mutation SignupMutation($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
    }
  }
`;

const Signup = ({ isOpen, onClose, onSignupSuccess, onSwitchToLogin }) => {
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
                if (response.signup) {
                    setSignupMessage('Signup successful!');
                    onSignupSuccess();
                }
            },
            onError: (error) => {
                setSignupMessage(error.message || 'Signup failed.');
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSignupMessage('');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-3xl font-bold">Create Account</DialogTitle>
                    <DialogDescription>Enter your details below to create an account.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={signupUsername}
                            onChange={e => setSignupUsername(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSignup} disabled={isMutationInFlight} className="w-full">Create Account</Button>
                    {signupMessage && <div>{signupMessage}</div>}
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Button variant="link" onClick={onSwitchToLogin} type="button">
                            Login
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Signup;
