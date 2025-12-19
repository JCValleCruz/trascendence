import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "secondary.main",
                color: "#790822ff",
                py: 2,
                px: 2,
                mt: "auto",
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Box
                    component="img"
                    src="./assets/lyrics-logo.png"
                    alt="Transcendence"
                    sx={{ height: 56, filter: "invert(1)" }}
                />
                <Box sx={{bgcolor: "primary.light", p: 0.5}}>
                    <Typography sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.875rem" }}>
                        © 2026 All Rights Reserved
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
