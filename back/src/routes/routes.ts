import 'dotenv/config';

// centralizamos las rutas. Por cada api, una ruta con su url nueva
// también creamos el objeto ENV, para simplificar llamar variables de entorno después
const root = '/api';

export const API_ROUTES = {
  root,
  auth: `${root}/auth`,
  user: `${root}/user`,
};

export const ENV = {
  PORT: process.env.PORT!,
  SQLITE_URI: process.env.SQLITE_URI!,
  // aquí habría que añadir el AUTH_SECRET, que se guardaría en .env
};
