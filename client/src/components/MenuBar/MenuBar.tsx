import React from 'react';
import { Link } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const MenuBar = ({ loggedIn, username, onLogout, setIsLoginModalOpen, setIsSignupModalOpen }) => {
    return (
        <div className="flex justify-between w-full px-4 py-2">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/create">Create Poll</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/poll">View Polls</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/mypolls">My Polls</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    {loggedIn ? (
                        <>
                            <NavigationMenuItem>
                                <span className="cursor-default mr-1">Welcome, {username}</span>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <button onClick={onLogout} className={navigationMenuTriggerStyle()}>
                                    Logout
                                </button>
                            </NavigationMenuItem>
                        </>
                    ) : (
                        <>
                            <NavigationMenuItem>
                                <button onClick={() => setIsSignupModalOpen(true)} className={navigationMenuTriggerStyle()}>
                                    Sign Up
                                </button>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <button onClick={() => setIsLoginModalOpen(true)} className={navigationMenuTriggerStyle()}>
                                    Login
                                </button>
                            </NavigationMenuItem>
                        </>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};

export default MenuBar;
