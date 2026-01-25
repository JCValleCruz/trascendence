import { jwtDecode } from "jwt-decode";
import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
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

interface UserPayload {
    id: number;
    username: string;
}

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
	const [user, setUser] = useState<UserPayload | null>(null);
    const isLoggedIn = !!user; // Si hay usuario, estás logueado. Truco pro.

	useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const decoded = jwtDecode<UserPayload>(token);
                setUser(decoded); // ¡PUM! Ya sabemos quién eres
            } catch (e) {
                localStorage.removeItem('auth_token'); // Si el token es falso, fuera
            }
        }
    }, []);

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);


    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        handleMenuClose();
        // navigate(path); // Uncomment when ready
    };

    // --- CORREGIDO AQUÍ ---
    const handleLogin = async (email: string, password: string) => {
        console.log("Login attempt:", email, password);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido en el servidor');
            }

            //setIsLoggedIn(true);
            setLoginModalOpen(false);

        } catch (error) {
            console.error('Error en login:', error);
        } // <--- FALTABA CERRAR EL CATCH
    }; // <--- FALTABA CERRAR LA FUNCIÓN handleLogin

    // --- CORREGIDO: handleRegister ahora está fuera de handleLogin ---
    const handleRegister = async (
        username: string,
        email: string,
        password: string
    ) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido en el servidor');
            }

            const data = await response.json();
            console.log('✅ Usuario registrado:', data);
            handleSwitchToLogin();
            return data;

        } catch (error: any) { // Añadido :any para evitar quejas de TS
            console.error('❌ Fallo en la matrix:', error.message);
        }
    };

    const handleResetPassword = async (email: string) => {
        try {
            console.log("Reset password attempt:", email);
            // TODO: Add your actual reset API call here??
        } catch (error) {
            console.error("Reset password failed:", error);
            throw error;
        }
    };

    const handleSwitchToLogin = () => {
        setRegisterModalOpen(false);
        setResetPasswordModalOpen(false);
        setLoginModalOpen(true);
    };

    const handleSwitchToRegister = () => {
        setLoginModalOpen(false);
        setRegisterModalOpen(true);
    };

    const handleSwitchToResetPassword = () => {
        setLoginModalOpen(false);
        setResetPasswordModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token'); // Borramos el DNI del bolsillo
        setUser(null); // Borramos el usuario de la memoria
        handleMenuClose();
        navigate("/");
        window.location.reload(); // Recargamos para limpiar todo
    };

    return (
        <>
            {/*Visible Header*/}
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: "primary.dark",
                    borderBottom: "2px solid",
                    borderColor: "secondary.main",
                    boxShadow: "none",
                }}
            >
                <Toolbar disableGutters variant="dense" sx={{ minHeight: 48, px: 0, gap: 0 }}>
                    {/* Logo */}
                    <Box
                        component="img"
                        src="/assets/lyrics-logo.png"
                        alt="Transcendence"
                        sx={{
                            filter: "invert(1)",
                            width: 145,
                            height: 36,
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
                            bgcolor: "primary.main",
                            borderLeft: "2px solid",
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
                {!isLoggedIn ? (
                    <>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setLoginModalOpen(true);
                            }}
                        >
                            Login
                        </MenuItem>
                        <Divider
                            sx={{
                                borderColor: "primary.light",
                                borderBottomWidth: 3,
                            }}
                        />
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setRegisterModalOpen(true);
                            }}
                        >
                            Register
                        </MenuItem>
                    </>
                ) : (
				<>
                        {/* AQUI ESTÁ LA MAGIA: Tu nombre en el menú */}
                        <MenuItem disabled sx={{ opacity: "1 !important", color: "primary.dark", fontWeight: "bold" }}>
                            Hola, {user?.username}
                        </MenuItem>
                        <Divider sx={{ borderColor: "primary.main", borderBottomWidth: 3 }} />
                        
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </>
                )}

                <Divider
                    sx={{ borderColor: "primary.main", borderBottomWidth: 3 }}
                />
                <MenuItem onClick={() => handleNavigate("/profile")}>
                    Profile
                </MenuItem>
                <Divider
                    sx={{ borderColor: "primary.dark", borderBottomWidth: 3 }}
                />
                <MenuItem onClick={() => handleNavigate("/stats")}>
                    Rankings
                </MenuItem>
                <Divider
                    sx={{ borderColor: "primary.light", borderBottomWidth: 3 }}
                />
                <MenuItem onClick={() => handleNavigate("/social")}>
                    Social
                </MenuItem>
            </Menu>

            {/* Login Modal */}
            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLogin={handleLogin}
                onSwitchToRegister={handleSwitchToRegister}
                onSwitchToResetPassword={handleSwitchToResetPassword}
            />

            {/* Register Modal */}
            <RegisterModal
                open={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                onRegister={handleRegister}
                onSwitchToLogin={handleSwitchToLogin}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                open={resetPasswordModalOpen}
                onClose={() => setResetPasswordModalOpen(false)}
                onResetPassword={handleResetPassword}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
};

export default Header;
