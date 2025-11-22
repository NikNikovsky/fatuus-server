import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { registerExampleConnector } from './connectors/exampleConnector';
import { setUserOnline } from './services/userStore';
import adminRouter from './routes/admin';

const app = express();
app.use(express.json());

// Serve simple static dashboard under /admin
app.use('/admin', express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/echo', (req, res) => res.json({ received: req.body }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Track online status via an `identify` message from the client: { type: 'identify', userId }
wss.on('connection', (ws) => {
  let identifiedUserId: string | null = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'identify' && typeof msg.userId === 'string') {
        identifiedUserId = msg.userId;
        setUserOnline(identifiedUserId as string, true);
        ws.send(JSON.stringify({ type: 'identified', payload: { userId: identifiedUserId } }));
        return;
      }

      if (msg.type === 'hello') {
        ws.send(JSON.stringify({ type: 'welcome', payload: 'hello client' }));
      } else {
        ws.send(JSON.stringify({ type: 'echo', payload: msg }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', payload: 'invalid json' }));
    }
  });

  ws.on('close', () => {
    if (identifiedUserId) setUserOnline(identifiedUserId, false);
  });
});

registerExampleConnector({ app, wss });

// mount admin API routes (under /api/admin/...)
app.use('/', adminRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${PORT}`);
});
