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
import { validateEmail } from "../utils/validation";

interface Props {
	open: boolean;
	onClose: () => void;
	onRegister: (username: string, email: string, pass: string) => Promise<void>;
	isLoading : Boolean;
	error?: string;
}

export const RegisterModal = ({open, onClose, onRegister, isLoading = false, error,}: Props) => {
	  const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) return;
        await onRegister(username, email, password);
    };

    const handleClose = () => {
        if (!isLoading) {
            setUsername("");
            setEmail("");
            setPassword("");
            setEmailError("");
            onClose();
        }
    };

    const handleSwitchToLogin = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setEmailError("");
        onSwitchToLogin();
    };
 const oAuthStyle = {
        backgroundColor: "#000000",
        color: "#FFFFFF",
        border: "2px solid #000000",
        "&:hover": {
            backgroundColor: "#FFFFFF",
            color: "#000000",
        }
    };
/* 	const handleRegister = async (username: string, email: string, password: string) => {
		try {
			const response = await fetch('http://localhost:3000/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			});

			if (response.status === 409) {
				triggerError("User or email already exists");
				return;
			}
			if (!response.ok) throw new Error("Register error");

			setRegisterModalOpen(false);
			setLoginModalOpen(true);
			triggerSuccess("Account created, please log in");
		} catch (error: any) {
			triggerError(error.message);
		}
	}; */

	return (
		<StyledDialog open={open} onClose={onClose}>
			<Box sx={{ p: 4 }}>
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
						Sign up for
					</Typography>
					<Typography variant="displayTitle">
						Transcendence
					</Typography>
				</Box>

				{/* BOTONES OAUTH VISIBLES */}
				<Stack spacing={2} sx={{ mb: 3 }}>
					<OAuthButton
						href="http://localhost:3000/api/auth/google"
						sx={oAuthStyle}
					>
						Sign up with Google
					</OAuthButton>

					<OAuthButton
						href="http://localhost:3000/api/auth/github"
						sx={oAuthStyle}
					>
						Sign up with Github
					</OAuthButton>
				</Stack>

				{/* {error && (
					<Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
						{error}
					</Alert>
				)} */}

				<form onSubmit={handleSubmit}>
					<Stack spacing={2}>
						<StyledTextField
							fullWidth
							type="text"
							label="USERNAME"
							name="username"
							autoComplete="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isLoading}
							required
						/>

						<StyledTextField
							fullWidth
							type="email"
							label="EMAIL"
							name="email"
							autoComplete="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError(validateEmail(e.target.value));
							}}
							disabled={isLoading}
							required
							error={!!emailError}
							helperText={emailError}
						/>

						<StyledTextField
							fullWidth
							type="password"
							label="PASSWORD"
							name="password"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							required
						/>

						<PrimaryAuthButton
							type="submit"
							disabled={isLoading || !username || !email || !password}
							sx={{ mt: 3 }}
						>
							{isLoading ? (
								<CircularProgress
									size={24}
									sx={{ color: "secondary.main" }}
								/>
							) : (
								"Create Account"
							)}
						</PrimaryAuthButton>
					</Stack>
				</form>

				<Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
					Already have an account?{" "}
					<Link
						component="button"
						type="button"
						onClick={handleSwitchToLogin}
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
						Log in
					</Link>
				</Typography>
			</Box>
			<button onClick={onClose}>Cerrar X</button>
		</StyledDialog>
	);

}
export default RegisterModal;