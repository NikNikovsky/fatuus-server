import { Router } from 'express';
import { listUsers, getUser, createUser, deleteUser } from '../services/userStore';

const router = Router();

// Serve a small JSON admin summary
router.get('/api/admin/summary', (_req, res) => {
  res.json({ users: listUsers().length });
});

// Users CRUD (simple)
router.get('/api/admin/users', (_req, res) => {
  res.json(listUsers());
});

router.post('/api/admin/users', (req, res) => {
  const { name, email, role } = req.body as any;
  if (!name) return res.status(400).json({ error: 'name required' });
  const u = createUser({ name, email, role });
  res.status(201).json(u);
});

router.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const found = getUser(id);
  if (!found) return res.status(404).json({ error: 'not found' });
  deleteUser(id);
  res.status(204).send();
});

export default router;
