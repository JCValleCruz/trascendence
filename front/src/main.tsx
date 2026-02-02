import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./style/theme";
import Frontend from "./Frontend";

import { SocketProvider } from "./context/SocketContext";

// Importa tus páginas
import MainPage from "./pages/MainPage";
import GamesPage from "./pages/GamesPage";

const MyRouter = () => <RouterProvider router={createBrowserRouter([
    {
        path: "/",
        element: <MainPage />, // Capa 1: Base
        children: [
            /* {
                path: "/",
                element: <GamesPage />,
            }, */
        ],
    },
])} />


createRoot(document.getElementById("root")!).render(
	<Frontend>
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <SocketProvider>
                <MyRouter/>
            </SocketProvider>
        </ThemeProvider>
    </Frontend>
);
// redux auth
// setState = login, register
// proceso el login
// el usuario se ha logeado
// boton -> mostrar otra cosa
// boton -> no mostrar registro
// ----------------------