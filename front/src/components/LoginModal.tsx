import { useState, type FC, type FormEvent } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    onLogin: (username: string, password: string) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

const LoginModal: FC<LoginModalProps> = ({
    open,
    onClose,
    onLogin,
    isLoading = false,
    error,
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        await onLogin(username, password);
    };

    const handleClose = () => {
        if (!isLoading) {
            setUsername("");
            setPassword("");
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <img
                                src="../../public/backgrounds/logo-inicio-sesion.png"
                                alt="eysa-logo"
                                style={{ height: "92px", width: "92px" }}
                            />
                        </Box>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            color="primary.main"
                            fontSize="32px"
                        >
                            Iniciar Sesión
                        </Typography>
                        {error && <Alert severity="error">{error}</Alert>}
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Contraseña"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ flexDirection: "column", gap: 1, pb: 4 }}>
                    <Stack spacing={2}>
                        <Button
                            type="submit"
                            sx={{ height: 48, minWidth: 395 }}
                            variant="contained"
                            disabled={isLoading || !username || !password}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                        <Button
                            type="button"
                            sx={{ height: 48, minWidth: 395 }}
                            variant="outlined"
                            disabled={isLoading}
                            onClick={handleClose}
                        >
                            Volver
                        </Button>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LoginModal;
