export interface User {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
  online?: boolean;
  lastSeen?: number | null;
}

const users = new Map<string, User>();

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function createUser(u: Omit<User, 'id' | 'online' | 'lastSeen'> & { id?: string }): User {
  const id = u.id || Math.random().toString(36).slice(2, 9);
  const user: User = { id, name: u.name, email: u.email, role: u.role || 'user', online: false, lastSeen: null };
  users.set(id, user);
  return user;
}

export function deleteUser(id: string): boolean {
  return users.delete(id);
}

export function setUserOnline(id: string, online: boolean) {
  const u = users.get(id);
  if (!u) return false;
  u.online = online;
  u.lastSeen = online ? null : Date.now();
  users.set(id, u);
  return true;
}

export function onlineCount(): number {
  let c = 0;
  for (const u of users.values()) if (u.online) c++;
  return c;
}

// seed a couple users for demo
createUser({ name: 'Admin User', email: 'admin@example.com', role: 'admin' });
createUser({ name: 'Example User', email: 'user@example.com' });
