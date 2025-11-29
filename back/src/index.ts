import { API_ROUTES, ENV } from './routes/routes.js';
import { connect, disconnect } from '../db/database.js';
import authApi from './apis/auth.api.js';
import  userApi from './apis/user.api.js';
import { createAPIServer } from "./server";

// Usamos nuestro servidor y marcamos ruta a las apis de nuestro backend
const app = createAPIServer();

app.use(API_ROUTES.auth, authApi);
app.use(API_ROUTES.user,/* aquí debería ir authenticationMiddleware,*/ userApi);

// conectamos con la base de datos
app.listen(ENV.PORT, async () => {
	await connect(ENV.SQLITE_URI);
	console.log('DB Mode');
	console.log(`API server is running on port ${ENV.PORT}`);
});

// desconectamos si se interrumpe
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await disconnect();
    process.exit(0);
});
