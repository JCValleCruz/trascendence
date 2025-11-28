export type Role = 'standard-user' | 'admin-user';

// Estandarizar el objeto con el que trabaja el navegador con datos de la sesión de usuario
// esto puede crecer bastante si queremos
export interface UserSession {
  id: string;
  role: Role;
}
