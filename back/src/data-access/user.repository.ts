import { db } from '../../db/database.js';
import { dbUser } from '../../db/db-models/users.js';

// Descibimos las funciones que extraen datos de la base de datos
export const userQueries = {
	findById: db.prepare<[number], dbUser>("SELECT * FROM users WHERE id = ?"),
	findByEmail: db.prepare<[string], dbUser>(
		"SELECT * FROM users WHERE email = ?"
	),
	getAll: db.prepare<[], dbUser>("SELECT * FROM users"),
};
