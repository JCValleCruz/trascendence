import { Router } from 'express';
import { db } from '../../db/database.js';

// Nuestra api de todo lo relacionado con el usuario
// con todos sus endpoints (y sus urls)
const userApi = Router();

userApi.get('/', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, email, created_at FROM users').all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

userApi.get('/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default userApi;
