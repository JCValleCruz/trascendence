import React from "react";
import { Menu } from "@mui/material";
//import { useAuthData } from "../hooks/useAuthData"; // Tu hook de usuario
//import { GuestOptions } from "./menu/GuestOptions";
//import { UserOptions } from "./menu/UserOptions";
import { PublicMenu } from "./PublicMenu";
import { PrivateMenu } from "./PrivateMenu";

interface HeaderMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    user: any; 
    onAuthChange: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ anchorEl, onClose, user, onAuthChange }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            sx={{ mt: 5 }}
        >
            {!user ? (
                <PublicMenu 
                    onClose={onClose} 
                    onLoginSuccess={onAuthChange} 
                />
            ) : (
                <PrivateMenu 
                    user={user} 
                    onClose={onClose} 
                    onLogoutSuccess={onAuthChange} 
                />
            )}
        </Menu>
    );
};