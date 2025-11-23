import { Router } from 'express';
import { listUsers, getUser, findByNameOrEmail, createUser, userCount } from '../services/userStore';
import bcrypt from 'bcryptjs';
import { createSession } from '../auth/sessions';

const router = Router();

// ping for clients to check server is reachable
router.get('/api/ping', (_req, res) => res.json({ ok: true, server: 'fatuus-server' }));

// OOBE info: whether server needs initial setup (no users exist)
router.get('/api/oobe', (_req, res) => {
  res.json({ needsSetup: userCount() === 0 });
});

router.post('/api/auth/login', (req, res) => {
  const { name, password } = req.body as any;
  if (!name || !password) return res.status(400).json({ error: 'name and password required' });
  const u = findByNameOrEmail(name);
  if (!u || !u.passwordHash) return res.status(401).json({ error: 'invalid credentials' });
  const ok = bcrypt.compareSync(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = createSession(u.id);
  res.json({ token, userId: u.id });
});

// Registration endpoint
// If no users exist, the first registered user may be created with role 'admin' by passing role='admin'.
router.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body as any;
  if (!name || !password) return res.status(400).json({ error: 'name and password required' });
  // unique name/email
  if (findByNameOrEmail(name) || (email && findByNameOrEmail(email))) {
    return res.status(409).json({ error: 'user with that name or email already exists' });
  }
  const isFirst = userCount() === 0;
  const assignedRole = role === 'admin' && isFirst ? 'admin' : 'user';
  const u = createUser({ name, email, role: assignedRole, password });
  const token = createSession(u.id);
  res.status(201).json({ userId: u.id, token });
});

export default router;
