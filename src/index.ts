import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { registerExampleConnector } from './connectors/exampleConnector';
```typescript
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { registerExampleConnector } from './connectors/exampleConnector';
import adminRouter from './routes/admin';

const app = express();
app.use(express.json());

// Serve simple static dashboard under /admin
app.use('/admin', express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/echo', (req, res) => res.json({ received: req.body }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'hello') {
        ws.send(JSON.stringify({ type: 'welcome', payload: 'hello client' }));
      } else {
        ws.send(JSON.stringify({ type: 'echo', payload: msg }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', payload: 'invalid json' }));
    }
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

```
