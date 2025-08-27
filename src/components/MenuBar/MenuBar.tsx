import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger
} from "../ui/menubar.tsx";
import Header from '../Header/Header.tsx'; // Import Header to reuse account info logic

const MenuBar = ({ loggedIn, username, onLogout }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm flex items-center justify-between px-4 py-2">
            <Menubar className="flex-grow-0"> {/* Navigation on the left */}
                <MenubarMenu>
                    <MenubarTrigger><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger><NavLink to="/create" className={({ isActive }) => isActive ? "active" : ""}>Create Poll</NavLink></MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger><NavLink to="/poll" className={({ isActive }) => isActive ? "active" : ""}>View Polls</NavLink></MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger><NavLink to="/mypolls" className={({ isActive }) => isActive ? "active" : ""}>My Polls</NavLink></MenubarTrigger>
                </MenubarMenu>
            </Menubar>
            <Header loggedIn={loggedIn} username={username} onLogout={onLogout} /> {/* Account info on the right */}
        </div>
    );
};

export default MenuBar;