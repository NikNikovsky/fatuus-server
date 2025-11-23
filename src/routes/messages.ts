import { Router } from 'express';
import { sendToUser } from '../ws/manager';

const router = Router();

// POST /api/send/:userId { type, payload }
router.post('/api/send/:userId', (req, res) => {
  const { userId } = req.params;
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'body required' });
  const ok = sendToUser(userId, body);
  if (!ok) return res.status(404).json({ error: 'user not connected' });
  res.json({ ok: true });
});

export default router;
