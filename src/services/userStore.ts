import { readJson, writeJson } from '../data/store';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  online?: boolean;
  lastSeen?: number | null;
  passwordHash?: string;
  files?: string[];
  prefs?: Record<string, any>;
}

const users = new Map<string, User>();

async function loadUsers() {
  const list = await readJson<User[]>('users.json', []);
  users.clear();
  for (const u of list) users.set(u.id, u);
}

async function saveUsers() {
  await writeJson('users.json', Array.from(users.values()));
}

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function createUser(u: Omit<User, 'id' | 'online' | 'lastSeen' | 'passwordHash' | 'files' | 'prefs'> & { id?: string; password?: string }): User {
  const id = u.id || uuidv4();
  const user: User = { id, name: u.name, email: u.email, role: u.role || 'user', online: false, lastSeen: null, files: [], prefs: {} };
  if ((u as any).password) {
    user.passwordHash = bcrypt.hashSync((u as any).password, 8);
  }
  users.set(id, user);
  void saveUsers();
  return user;
}

export function deleteUser(id: string): boolean {
  const ok = users.delete(id);
  void saveUsers();
  return ok;
}

export function setUserOnline(id: string, online: boolean) {
  const u = users.get(id);
  if (!u) return false;
  u.online = online;
  u.lastSeen = online ? null : Date.now();
  users.set(id, u);
  void saveUsers();
  return true;
}

export function onlineCount(): number {
  let c = 0;
  for (const u of users.values()) if (u.online) c++;
  return c;
}

export function findByNameOrEmail(nameOrEmail: string): User | undefined {
  const lc = nameOrEmail.toLowerCase();
  for (const u of users.values()) {
    if (u.name.toLowerCase() === lc) return u;
    if (u.email && u.email.toLowerCase() === lc) return u;
  }
  return undefined;
}

export function userCount(): number {
  return users.size;
}

// initialize by loading persisted users (if any)
void (async () => {
  await loadUsers();
})();
