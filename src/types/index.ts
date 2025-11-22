import { Express } from 'express';
import { WebSocketServer } from 'ws';

export interface ConnectorContext {
  app: Express;
  wss: WebSocketServer;
  config?: Record<string, any>;
}
