import { db } from "../database.js";

// Esta inerfaz marca qué formato tiene el objeto User cuando lo leemos de la base de datos.
// Por ahora no lo usamos, pero lo usaremos.
export interface dbUser {
	id: number;
	username: string;
	email: string;
    password: string; // Debe cambiarse por hashedPassword cuando lo tengamos
    //salt: aquí debe ir el tipo de la salt;
	created_at: string;
}

// Esto es para crear usuarios nuevos, ya que el id y la estampa de tiempo lo crea sqlite automático
export type NewUser = Omit<dbUser, 'id' | 'created_at'>;
