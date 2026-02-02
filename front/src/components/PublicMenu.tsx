import React, { useState } from "react";
import { MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
//import LoginModal from "../LoginModal";
//import RegisterModal from "../RegisterModal";
//import ResetPasswordModal from "../ResetPasswordModal";

interface PublicMenuProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

export const PublicMenu: React.FC<PublicMenuProps> = ({ onClose, onLoginSuccess }) => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<"login" | "register" | "reset" | null>(null);

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Credential error');

            localStorage.setItem('auth_token', data.token);
            onLoginSuccess(); // ¡Éxito! Avisamos arriba
            setModal(null);   // Cerramos modales
            onClose();        // Cerramos menú
        } catch (error: any) {
            alert(error.message); // O tu lógica de notificaciones
        }
    };
    const handleRegister = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            if (response.status === 409) return alert("User or email already exists");
            if (!response.ok) throw new Error("Register error");

            setModal("login");
            alert("Account created, please log in");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <>
            <MenuItem onClick={() => { onClose(); setModal("login"); }}>Login</MenuItem>
            <MenuItem onClick={() => { onClose(); setModal("register"); }}>Register</MenuItem>
            <Divider />
            <MenuItem onClick={() => { onClose(); navigate("/stats"); }}>Rankings</MenuItem>

            {/* MODALES ENCAPSULADOS AQUÍ */}
           {/*  <LoginModal 
                open={modal === "login"} 
                onClose={() => setModal(null)} 
                onLogin={handleLogin}
                onSwitchToRegister={() => setModal("register")}
                onSwitchToResetPassword={() => setModal("reset")}
            />
            <RegisterModal 
                open={modal === "register"} 
                onClose={() => setModal(null)} 
                onRegister={handleRegister}
                onSwitchToLogin={() => setModal("login")}
            />
            <ResetPasswordModal 
                open={modal === "reset"} 
                onClose={() => setModal(null)} 
                onResetPassword={async () => {}} // Tu lógica de reset
                onSwitchToLogin={() => setModal("login")}
            /> */}
        </>
    );
};