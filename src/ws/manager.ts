import { WebSocket } from 'ws';

const userSockets = new Map<string, Set<WebSocket>>();

export function addSocketForUser(userId: string, ws: WebSocket) {
  let set = userSockets.get(userId);
  if (!set) {
    set = new Set();
    userSockets.set(userId, set);
  }
  set.add(ws);
}

export function removeSocketForUser(userId: string, ws: WebSocket) {
  const set = userSockets.get(userId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) userSockets.delete(userId);
}

export function sendToUser(userId: string, payload: any) {
  const set = userSockets.get(userId);
  if (!set) return false;
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  for (const ws of set) {
    try {
      ws.send(data);
    } catch (err) {
      // ignore
    }
  }
  return true;
}

export function broadcast(payload: any) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  for (const set of userSockets.values()) for (const ws of set) ws.send(data);
}

export function getConnectedUserIds(): string[] {
  return Array.from(userSockets.keys());
}
