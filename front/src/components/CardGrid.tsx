import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

// Definimos qué propiedades acepta esta tarjeta
interface GameCardProps {
    title: string;
    icon: ReactNode;
    isActive?: boolean;
}

const GameCard = ({ title, icon, isActive = false }: GameCardProps) => {
    const theme = useTheme();

    // --- COLORES EXACTOS DE LA REFERENCIA ---
    const borderColor = theme.palette.primary.main; // Negro puro (del tema)
    // Este es el gris plano específico del interior de las tarjetas en la foto
    const iconAreaBgColor = "#e5e7eb"; 
    
    // Colores del pie de página según si está activo o no
    const footerBgColor = isActive ? theme.palette.primary.main : theme.palette.background.paper;
    const footerTextColor = isActive ? theme.palette.secondary.main : theme.palette.primary.main;

    return (
        <Paper
            elevation={0}
            sx={{
                // Altura responsiva (móvil vs escritorio)
                height: { xs: "400px", md: "55vh" },
                display: 'flex',
                flexDirection: 'column',
                // Borde grueso negro
                border: `2px solid ${borderColor}`, 
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-8px)",
                    // Sombra dura negra al pasar el ratón
                    boxShadow: `8px 8px 0px ${borderColor}` 
                }
            }}
        >
            {/* Parte superior (Área del Icono con el gris específico) */}
            <Box
                sx={{
                    bgcolor: iconAreaBgColor, // <-- APLICAMOS EL COLOR GRIS AQUÍ
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                }}
            >
                {/* Icono gigante */}
                <Box sx={{ '& svg': { fontSize: { xs: 100, md: 140 }, transition: "0.2s" } }}>
                    {icon}
                </Box>
            </Box>

            {/* Parte inferior (Banner de Título de alto contraste) */}
            <Box
                sx={{
                    bgcolor: footerBgColor,
                    color: footerTextColor,
                    py: 3,
                    px: 2,
                    textAlign: "center",
                    // Línea divisoria negra
                    borderTop: `4px solid ${borderColor}`, 
                }}
            >
                {/* Tipografía gruesa (Bold 700/900) */}
                <Typography variant="h5" sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 }}>
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
};

export default GameCard;