import { Router } from 'express';  // ← Importas Router, NO app

// Nuestra api de todo lo relacionado con el login y logout
// con todos sus endpoints (y sus urls)
const authApi = Router();  // ← Creas un router

authApi.post('/register', (req, res) => {
  // tu código
});

authApi.post('/login', (req, res) => {
  // tu código
});

// faltaría aquí el logout

export default authApi;  // ← Exportas el router