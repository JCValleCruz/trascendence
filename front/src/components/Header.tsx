import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	Box,
	AppBar,
	Toolbar,
	IconButton,
	Menu,
	MenuItem,
	Divider,
	Snackbar,
	Alert,
	Avatar,
	Badge,
	ClickAwayListener
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
	MarqueeContainer,
	MarqueeTrack,
	MarqueeContent,
} from "../style/MarqueeStyle";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ResetPasswordModal from "./ResetPasswordModal";
import AuthErrorNotification from "./AuthErrorNotification";
import UserList from "./UserList";
import { SocialPanel } from "./SocialPanel";
import { useSocket } from "../context/SocketContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";


const Header = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { unreadCount } = useSocket();
	const { notifySuccess, notifyError } = useNotification();
	const { user, login, register, logout } = useAuth();
	// --- ESTADOS ---

	// Modales
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [registerModalOpen, setRegisterModalOpen] = useState(false);
	const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
	const [seeAllUsers, setSeeAllUsers] = useState(false);
	const [socialOpen, setSocialOpen] = useState(false);

	const closeAllModals = () => {
		setLoginModalOpen(false);
		setRegisterModalOpen(false);
		setResetPasswordModalOpen(false);
		setSeeAllUsers(false);
		setSocialOpen(false);
		// Cierra también el menú desplegable si estuviera abierto
		setAnchorEl(null);

	};

	// Uso de parámetros de búsqueda para manejar errores de OAuth
	useEffect(() => {
		const errorType = searchParams.get("error");
		if (errorType) {
			const message = errorType === "user_exists"
				? "Email already registered"
				: "External auth error";
			notifyError(message);
			setSearchParams({});
		}
	}, [searchParams, setSearchParams, notifyError]);
	// --- HANDLERS ---
	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const handleNavigate = (path: string) => {
		handleMenuClose();
		navigate(path);
	};

	// --- AUTH LOGIC ---
	const onLoginSubmit = async (email: string, pass: string) => {
		const success = await login(email, pass);
		if (success)
			setLoginModalOpen(false);
	};

	const onRegisterSubmit = async (username: string, email: string, pass: string) => {
		const success = await register(username, email, pass);
		if (success) {
			setRegisterModalOpen(false);
			setLoginModalOpen(true); // Mandar al login tras registro
		}
	};

	const onLogoutClick = () => {
		logout();
		closeAllModals();
		navigate("/");
	};

	const switchToLogin = () => { setRegisterModalOpen(false); setResetPasswordModalOpen(false); setLoginModalOpen(true); };
	const switchToRegister = () => { setLoginModalOpen(false); setRegisterModalOpen(true); };
	const switchToReset = () => { setLoginModalOpen(false); setResetPasswordModalOpen(true); };

	return (
		<>
			<AppBar position="fixed" sx={{ bgcolor: "primary.dark", borderBottom: "2px solid", borderColor: "secondary.main", boxShadow: "none" }}>
				<Toolbar disableGutters variant="dense" sx={{ minHeight: 48, px: 0 }}>
					<Box component="img" src="/assets/lyrics-logo.png" sx={{ filter: "invert(1)", width: 145, height: 36, bgcolor: "secondary.main", px: 1 }} />
					<MarqueeContainer>
						<MarqueeTrack><MarqueeContent>Pong Tournament • Join the Arena • Win • Glory • </MarqueeContent></MarqueeTrack>
					</MarqueeContainer>

					<IconButton onClick={handleMenuOpen} sx={{ width: 48, height: "100%", bgcolor: "primary.main", borderLeft: "2px solid", borderRadius: 0, "&:hover": { bgcolor: "grey.900" }, flexShrink: 0 }}>
						<Badge badgeContent={unreadCount} color="error" overlap="circular" >
							{user ? (
								<Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", color: "primary.dark", fontWeight: "bold", fontSize: "1.2rem", border: "2px solid #000" }}>
									{user.username.charAt(0).toUpperCase()}
								</Avatar>
							) : (<MenuIcon sx={{ color: "background.default" }} />)}
						</Badge>
					</IconButton>
				</Toolbar>
			</AppBar>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 5 }}>
				{!user && <MenuItem onClick={() => { handleMenuClose(); setLoginModalOpen(true); }}>Login</MenuItem>}
				{!user && <MenuItem onClick={() => { handleMenuClose(); setRegisterModalOpen(true); }}>Register</MenuItem>}
				{!user && <Divider />}
				{!user && <MenuItem onClick={() => handleNavigate("/stats")}>Rankings</MenuItem>}
				{user && <MenuItem disabled sx={{ opacity: "1 !important", color: "primary.main", fontWeight: "bold" }}>Hola, {user.username}</MenuItem>}
				{user && <MenuItem onClick={() => handleNavigate("/profile")}>Profile</MenuItem>}
				{user && <MenuItem onClick={() => { handleMenuClose(); setSocialOpen(!socialOpen); }}>Social</MenuItem>}
				{user && <MenuItem onClick={() => { handleMenuClose(); setSeeAllUsers(true); }}>Admin: Ver Lista Usuarios</MenuItem>}
				{user && <Divider />}
				{user && <MenuItem onClick={onLogoutClick}>Logout</MenuItem>}
			</Menu>

			<LoginModal
				open={loginModalOpen}
				onClose={() => setLoginModalOpen(false)}
				onLogin={onLoginSubmit}
				onSwitchToRegister={switchToRegister}
				onSwitchToResetPassword={switchToReset}
			/>
			<RegisterModal
				open={registerModalOpen}
				onClose={() => setRegisterModalOpen(false)}
				onRegister={onRegisterSubmit}
				onSwitchToLogin={switchToLogin}
			/>
			<ResetPasswordModal
				open={resetPasswordModalOpen}
				onClose={() => setResetPasswordModalOpen(false)}
				onResetPassword={async () => { }}
				onSwitchToLogin={switchToLogin}
			/>

			<UserList open={seeAllUsers} onClose={() => setSeeAllUsers(false)} />
			<SocialPanel open={socialOpen} onClose={() => setSocialOpen(false)} />
		</>
	);
};

export default Header;