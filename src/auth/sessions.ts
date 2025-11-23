import { v4 as uuidv4 } from 'uuid';

const sessions = new Map<string, { userId: string; created: number }>();

export function createSession(userId: string) {
  const token = uuidv4();
  sessions.set(token, { userId, created: Date.now() });
  return token;
}

export function getSession(token: string) {
  return sessions.get(token);
}

export function revokeSession(token: string) {
  return sessions.delete(token);
}
