import { db } from "../database.js";

export interface User {
	id: number;
	username: string;
	email: string;
	created_at: string;
}

export const userQueries = {
	findById: db.prepare<[number], User>("SELECT * FROM users WHERE id = ?"),
	findByEmail: db.prepare<[string], User>(
		"SELECT * FROM users WHERE email = ?"
	),
	getAll: db.prepare<[], User>("SELECT * FROM users"),
};
