import React, { useState } from "react";
import { MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
//import UserList from "../UserList";     // Tu lista de usuarios
//import { SocialPanel } from "../SocialPanel"; // Tu panel social

interface PrivateMenuProps {
    user: { username: string }; 
    onClose: () => void;
    onLogoutSuccess: () => void;
}

export const PrivateMenu: React.FC<PrivateMenuProps> = ({ user, onClose, onLogoutSuccess }) => {
    const navigate = useNavigate();
    const [showSocial, setShowSocial] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);

    // --- LÓGICA DE LOGOUT (Extraída) ---
    const handleLogout = () => {
        onClose(); // Cerrar menú visual
        const token = localStorage.getItem('auth_token');
        if (token) {
            fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => console.error("Logout fetch error", err));
        }
        localStorage.removeItem('auth_token');
        onLogoutSuccess(); // Avisamos arriba para limpiar estado
        navigate("/");
    };

    return (
        <>
            <MenuItem disabled sx={{ opacity: "1 !important", color: "primary.main", fontWeight: "bold" }}>
                Hola, {user.username}
            </MenuItem>

            <MenuItem onClick={() => { onClose(); navigate("/profile"); }}>Profile</MenuItem>
            
            <MenuItem onClick={() => { onClose(); setShowSocial(true); }}>Social</MenuItem>
            
            <MenuItem onClick={() => { onClose(); setShowAdmin(true); }}>Admin: Ver Lista Usuarios</MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>Logout</MenuItem>

            {/* PANELES QUE SOLO EL USUARIO PUEDE VER */}
            {/* <SocialPanel open={showSocial} onClose={() => setShowSocial(false)} />
            <UserList open={showAdmin} onClose={() => setShowAdmin(false)} /> */}
        </>
    );
};