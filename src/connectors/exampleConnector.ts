import type { ConnectorContext } from '../types';

export function registerExampleConnector(ctx: ConnectorContext) {
  const { app, wss } = ctx;

  app.get('/connector/info', (_req, res) => {
    res.json({ name: 'example-connector', version: '0.1.0' });
  });

  // Broadcast a heartbeat event every 10s
  setInterval(() => {
    wss.clients.forEach((client) => {
      // readyState === 1 is OPEN
      // @ts-ignore - runtime check
      if (client.readyState === 1) {
        // @ts-ignore
        client.send(JSON.stringify({ type: 'server:tick', ts: Date.now() }));
      }
    });
  }, 10000);
}
