import { useState, type FormEvent } from "react";
import {
    Box,
    Stack,
    Typography,
    CircularProgress,
    Alert,
    Link,
} from "@mui/material";
import {
    StyledDialog,
    StyledTextField,
    PrimaryAuthButton,
    OAuthButton,
} from "../style/AuthModalStyle";

interface Props {
    open: boolean;
    onClose: () => void;
    onLogin: (username: string, password: string) => Promise<void>;
    onSwitchToRegister: () => void;
    isLoading?: boolean;
    error?: string;
}

const LoginModal = ({
    open,
    onClose,
    onLogin,
    onSwitchToRegister,
    isLoading = false,
    error,
}: Props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        await onLogin(email, password);
    };

    const handleClose = () => {
        if (!isLoading) {
            setEmail("");
            setPassword("");
            onClose();
        }
    };

    const handleSwitchToRegister = () => {
        setEmail("");
        setPassword("");
        onSwitchToRegister();
    };

    return (
        <StyledDialog open={open} onClose={handleClose}>
            <Box sx={{ p: 4 }}>
                {/* Title */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                        variant="authSubtitle"
                        sx={{
                            borderBottom: "2px solid",
                            borderColor: "secondary.main",
                            display: "inline-block",
                            pb: 0.5,
                            mb: 1,
                        }}
                    >
                        Sign in to
                    </Typography>
                    <Typography variant="displayTitle">
                        Transcendence
                    </Typography>
                </Box>

                {/* OAuth Buttons */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <OAuthButton startIcon={<span>G</span>}>
                        <Typography variant="subtitle1">
                            Continue with Google
                        </Typography>
                    </OAuthButton>
                    <OAuthButton startIcon={<span>🐙</span>}>
                        <Typography variant="subtitle1">
                            Continue with Github
                        </Typography>
                    </OAuthButton>
                </Stack>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <StyledTextField
                            fullWidth
                            type="email"
                            label="EMAIL"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <StyledTextField
                            fullWidth
                            type="password"
                            label="PASSWORD"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />

                        <PrimaryAuthButton
                            type="submit"
                            disabled={isLoading || !email || !password}
                            sx={{ mt: 3 }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} sx={{ color: "secondary.main" }} />
                            ) : (
                                "Log in"
                            )}
                        </PrimaryAuthButton>
                    </Stack>
                </form>

                {/* Reset Password Link */}
                <Link
                    href="#"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 2,
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
                        textUnderlineOffset: "4px",
                        color: "text.secondary",
                        "&:hover": {
                            color: "text.primary",
                        },
                    }}
                >
                    <Typography variant="subtitle1">Reset password</Typography>
                </Link>

                {/* Switch to Register */}
                <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
                    No account?{" "}
                    <Link
                        component="button"
                        type="button"
                        onClick={handleSwitchToRegister}
                        sx={{
                            fontWeight: 900,
                            fontFamily: "'Archivo Black', sans-serif",
                            textDecoration: "underline",
                            textDecorationColor: "accent.yellow",
                            textDecorationThickness: "4px",
                            textUnderlineOffset: "2px",
                            color: "text.primary",
                            "&:hover": { color: "accent.yellowDark" },
                        }}
                    >
                        Create one
                    </Link>
                </Typography>
            </Box>
        </StyledDialog>
    );
};

export default LoginModal;
