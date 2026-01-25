import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const Frontend = () => {
    
	useEffect(() => {
        // 1. Buscamos si hay un token en la URL (lo que nos manda el Back)
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            console.log("🔑 Token detectado. Guardando sesión...");

            // 2. Guardamos el token en el navegador
            localStorage.setItem('auth_token', token);

            // 3. Limpiamos la URL para que no se vea el token feo
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // 4. Recargamos para que la App (MainPage) lea el token nuevo
            window.location.reload();
        }
    }, []);
	return (
        <>
            <main
                style={{
                    minHeight: "800px",
                    margin: 0,
                    padding: 0,
                    width: "100%",
                }}
            >
                <Outlet />
            </main>
        </>
    );
};

export default Frontend;
