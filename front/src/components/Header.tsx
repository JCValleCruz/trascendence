import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, keyframes } from "@mui/material/styles";

// Styled Components
const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const MarqueeContainer = styled(Box)({
    backgroundColor: "black",
    color: "white",
    overflow: "hidden",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    height: "100%",
    position: "relative",
});

const MarqueeTrack = styled(Box)({
    display: "flex",
    width: "max-content",
    animation: `${marquee} 50s linear infinite`,
});

const MarqueeContent = styled(Typography)({
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    whiteSpace: "nowrap",
    flexShrink: 0,
});

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        handleMenuClose();
        // navigate(path);
    };

    const handleLogout = () => {
        // CleanSession(userId) or similar // TODO: implement userSession clearing (token...)
        setIsLoggedIn(false);
        handleMenuClose();
        navigate("/");
    };

    return (
        <>
            {/*Visible Header*/}
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: "primary.dark",
                    borderTop: "2px solid",
                    borderBottom: "2px solid",
                    borderColor: "secondary.main",
                    boxShadow: "none",
                }}
            >
                <Toolbar sx={{ minHeight: 48, px: 0, gap: 0 }}>
                    {/* Logo */}
                    <Box
                        component="img"
                        src="./assets/lyrics-logo.png"
                        alt="Transcendence"
                        sx={{
                            filter: "invert(1)",
                            width: 290,
                            height: 80,
                            bgcolor: "secondary.main",
                            borderRight: "2px solid",
                            borderColor: "secondary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    ></Box>

                    {/* Marquee */}
                    <MarqueeContainer>
                        <MarqueeTrack>
                            <MarqueeContent>
                                Pong Tournament • Join the Arena • Win • Glory •
                                Pong Tournament • Join the Arena • Win • Glory •
                                Pong Tournament • Join the Arena • Win • Glory •
                            </MarqueeContent>
                            <MarqueeContent>
                                Pong Tournament • Join the Arena • Win • Glory •
                                Pong Tournament • Join the Arena • Win • Glory •
                                Pong Tournament • Join the Arena • Win • Glory •
                            </MarqueeContent>
                        </MarqueeTrack>
                    </MarqueeContainer>

                    {/* Menu Button */}
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            width: 48,
                            height: "100%",
                            bgcolor: "secondary.main",
                            borderLeft: "2px solid",
                            borderColor: "background.default",
                            borderRadius: 0,
                            "&:hover": {
                                bgcolor: "grey.900",
                            },
                            flexShrink: 0,
                        }}
                    >
                        <MenuIcon
                            sx={{
                                color: "background.default",
                            }}
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Menu Dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    mt: 5,
                    "& .MuiPaper-root": {
                        bgcolor: "grey.300",
                        border: "2px solid",
                        borderColor: "secondary.main",
                        borderRadius: 2,
                        minWidth: 200,
                    },
                    "& .MuiMenuItem-root": {
                        height: 50,
                        fontSize: 20,
                        color: "grey.800",
                        fontWeight: 900,
                    },
                }}
            >
                {/* Conditional rendering based on login status */}
                {!isLoggedIn ? (
                    <>
                        <MenuItem onClick={() => handleMenuItemClick("/login")}>
                            Login
                        </MenuItem>
                        <Divider sx={{ borderColor: "primary.light", borderBottomWidth: 5 }} />
                        <MenuItem
                            onClick={() => handleMenuItemClick("/register")}
                        >
                            Register
                        </MenuItem>
                    </>
                ) : (
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                )}

                <Divider sx={{ borderColor: "primary.main", borderBottomWidth: 3 }} />
                <MenuItem onClick={() => handleMenuItemClick("/profile")}>
                    My Profile
                </MenuItem>
                <Divider sx={{ borderColor: "primary.dark", borderBottomWidth: 3 }} />
                <MenuItem onClick={() => handleMenuItemClick("/stats")}>
                    Stats
                </MenuItem>
                <Divider sx={{ borderColor: "primary.light", borderBottomWidth: 5 }} />
                <MenuItem onClick={() => handleMenuItemClick("/pong")}>
                    Pong
                </MenuItem>
                <Divider sx={{ borderColor: "primary.main", borderBottomWidth: 3 }} />
                <MenuItem onClick={() => handleMenuItemClick("/other-game")}>
                    Other Game
                </MenuItem>
                <Divider sx={{ borderColor: "primary.dark", borderBottomWidth: 3 }} />

                <MenuItem onClick={() => handleMenuItemClick("/social")}>
                    Social
                </MenuItem>
            </Menu>
        </>
    );
};

export default Header;
