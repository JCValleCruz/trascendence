import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "../theme";
import Frontend from "./Frontend";
import MainPage from "./pages/MainPage";
// import ProfilePage from "./pages/ProfilePage";
// import SinglePlayerPage from "./pages/SinglePlayerPage";
// import OneOnOnePage from "./pages/OneOnOnePage";

const AppWithTheme = () => {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Frontend />,
        children: [
            {
                index: true,
                element: <MainPage />,
            //     children: [
            //         {
            //             path: 'singlePlayer',
            //             element: <SinglePlayerPage />,
            //         },
            //         {
            //             path: 'oneOnOne',
            //             element: <OneOnOnePage />,
            //         },
            //     ],
            // },
        //     {
        //         path: "profile",
        //         element: <ProfilePage />,
        //     },
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppWithTheme />
    </StrictMode>
);
