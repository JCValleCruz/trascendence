import express from "express";
import dotenv from 'dotenv';

// Aquí solo creamos el servidor, luego le añadiremos cookie parser y el cors y le damos las variables de entorno
dotenv.config();

export const createAPIServer = () => {
	const app = express();
	app.use(express.json());
	// aquí habria que hacer app.use del cookieParse() y app.use de cors({...})

	return app;
}
