import { Router } from 'express';
import { listUsers, getUser, createUser, deleteUser } from '../services/userStore';
import { getSession } from '../auth/sessions';

function requireAuth(req: any, res: any, next: any) {
  const h = req.headers?.authorization as string | undefined;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'unauthorized' });
  const token = h.slice('Bearer '.length);
  const s = getSession(token);
  if (!s) return res.status(401).json({ error: 'unauthorized' });
  // attach user id
  req.userId = s.userId;
  next();
}

const router = Router();

// Serve a small JSON admin summary
router.get('/api/admin/summary', requireAuth, (_req, res) => {
  // include online count
  const users = listUsers();
  res.json({ users: users.length, online: users.filter(u => u.online).length });
});

// Users CRUD (simple)
router.get('/api/admin/users', requireAuth, (_req, res) => {
  res.json(listUsers());
});

router.post('/api/admin/users', requireAuth, (req, res) => {
  const { name, email, role, password } = req.body as any;
  if (!name) return res.status(400).json({ error: 'name required' });
  const u = createUser({ name, email, role, password });
  res.status(201).json(u);
});

router.delete('/api/admin/users/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const found = getUser(id);
  if (!found) return res.status(404).json({ error: 'not found' });
  deleteUser(id);
  res.status(204).send();
});

export default router;
