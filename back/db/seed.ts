import { db } from './database.js';

console.log('Seeding database...');

db.exec('DELETE from users');

const insertUser = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?');

const users = [
	{username: 'Gabriel', email: 'gabriel@test.com', password: "pass123"},
	{username: 'Jorge', email: 'jorge@test.com', password: "pass123"},
	{username: 'Juan Carlos', email: 'jcarlos@test.com', password: "pass123"},
	{username: 'Jose Ricardo', email: 'jricardo@test.com', password: "pass123"},
	{username: 'Patrick', email: 'patrick@test.com', password: "pass123"}
];

const userIds: number[] = [];

users.forEach(user => {
	const result = insertUser.run(user.username, user.email, user.password);
	userIds.push(result.lastInsertRowid as number);
	console.log(`Created user: ${user.username}`);
});

console.log('Database seeded succesfully!');

db.close();
