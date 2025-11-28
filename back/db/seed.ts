import { connect, disconnect, db } from './database.js';
import { NewUser } from './db-models/users.js';

// Datos semilla para nuestra base de datos (se inyectan ejecutando 'npm run seed' en la raiz del back)
console.log('Seeding database...');

await connect('../data/dev.sqlite');

db.exec('DELETE from users');

const insertUser = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');

const users: NewUser[] = [
	{username: 'Gabriel', email: 'gabriel@test.com', password: "pass1"},
	{username: 'Jorge', email: 'jorge@test.com', password: "pass2"},
	{username: 'Juan Carlos', email: 'jcarlos@test.com', password: "pass3"},
	{username: 'Jose Ricardo', email: 'jricardo@test.com', password: "pass4"},
	{username: 'Patrick', email: 'patrick@test.com', password: "pass5"}
];

const userIds: number[] = [];

users.forEach(user => {
	const result = insertUser.run(user.username, user.email, user.password);
	userIds.push(result.lastInsertRowid as number);
	console.log(`Created user: ${user.username}`);
});

console.log('Database seeded succesfully!');

await disconnect();
