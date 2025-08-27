import React from 'react';
import { Link } from 'react-router-dom';
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";

const MenuBar = () => {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger><Link to="/">Home</Link></MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger><Link to="/create">Create Poll</Link></MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger><Link to="/poll">View Polls</Link></MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger><Link to="/mypolls">My Polls</Link></MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    );
};

export default MenuBar;
