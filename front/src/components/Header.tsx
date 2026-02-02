import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { MarqueeContainer, MarqueeTrack, MarqueeContent } from "../style/MarqueeStyle";
import { HeaderMenu } from "./HeaderMenu";
import { jwtDecode } from "jwt-decode"; 
//import { useSocket } from "../context/SocketContext";

const Header = () => {
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<any>(null);
    //const { unreadCount } = useSocket();

    const refreshUser = () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ bgcolor: "primary.dark", borderBottom: "2px solid", borderColor: "secondary.main", boxShadow: "none" }}>
                <Toolbar disableGutters variant="dense" sx={{ minHeight: 48, px: 0 }}>
                    <Box component="img" src="/assets/lyrics-logo.png" sx={{ filter: "invert(1)", width: 145, height: 36, bgcolor: "secondary.main", px: 1 }} />
                    <MarqueeContainer>
                        <MarqueeTrack>
                            <MarqueeContent> Pong Tournament • Join the Arena • Win • Glory • Pong Tournament • Join the Arena • Win • Glory Pong Tournament • Join the Arena • Win • Glory •</MarqueeContent>
                            <MarqueeContent> Pong Tournament • Join the Arena • Win • Glory • Pong Tournament • Join the Arena • Win • Glory Pong Tournament • Join the Arena • Win • Glory •</MarqueeContent>
                        </MarqueeTrack>
                    </MarqueeContainer>

                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            width: 48, height: "100%", bgcolor: "primary.main", 
                            borderLeft: "2px solid", borderRadius: 0, flexShrink: 0,
                            "&:hover": { bgcolor: "grey.900" },
                        }}
                    >
                       <Badge badgeContent={0 /* unreadCount */} color="error" overlap="circular">
                            {user ? (
                                <Avatar sx={{
                                    width: 32, height: 32, bgcolor: "secondary.main", 
                                    color: "primary.dark", fontWeight: "bold", 
                                    fontSize: "1.2rem", border: "2px solid #000"
                                }}>
                                    {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            ) : (
                                <MenuIcon sx={{ color: "background.default" }} />
                            )}
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <HeaderMenu 
                anchorEl={anchorEl} 
                onClose={handleMenuClose} 
                user={user}
                onAuthChange={refreshUser}
            />
        </>
    );
};

export default Header;