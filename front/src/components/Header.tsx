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

import MenuButton from "./MenuButton";
import RegisterModal from "./RegisterModal";


const Header = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleMenuButtonOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}
	const handleMenuButtonClose = () => {
		setAnchorEl(null)
	};
	const [username, setUsername] = useState<string | null>(null);

	const [registerOpen, setRegisterOpen] = useState(false); // Estado del modal

	const [loginOpen, setLoginOpen] = useState(false); // Estado del modal

    const handleOpenRegister = () => {
        setAnchorEl(null); // Cerramos el menú primero
        setRegisterOpen(true); // Abrimos el modal
    };

	return (
		<>
			<AppBar position="fixed" sx={{ bgcolor: "primary.dark", borderBottom: "2px solid", borderColor: "secondary.main", boxShadow: "none" }}>
				<Toolbar disableGutters variant="dense" sx={{ minHeight: 48, px: 0 }}>
					<Box component="img" src="/assets/lyrics-logo.png" sx={{ filter: "invert(1)", width: 145, height: 36, bgcolor: "secondary.main", px: 1 }} />
					<MarqueeContainer>
						<MarqueeTrack>
							<MarqueeContent>Pong Tournament • Join the Arena • Win • Glory • </MarqueeContent>
						</MarqueeTrack>
					</MarqueeContainer>

					{/* BOTÓN DEL MENÚ (ICONO vs AVATAR) */}
					<IconButton
						onClick={handleMenuButtonOpen}
						sx={{
							width: 48,
							height: "100%",
							bgcolor: "primary.main",
							borderLeft: "2px solid",
							borderRadius: 0,
							"&:hover": { bgcolor: "grey.900" },
							flexShrink: 0
						}}
					>
						<MenuIcon sx={{ color: "background.default" }} />
					</IconButton>
				</Toolbar>
			</AppBar>
			<MenuButton
				anchorEl={anchorEl}
				onClose={handleMenuButtonClose}
				username={username}
				onRegisterClick={handleOpenRegister}
			/>
			<RegisterModal 
                open={registerOpen} 
                onClose={() => setRegisterOpen(false)} 
            />

		</>
	);
};

export default Header;


