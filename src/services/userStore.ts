export interface User {
  id: string;
  name: string;
  email?: string;
  role?: 'admin' | 'user';
}

const users = new Map<string, User>();

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function createUser(u: Omit<User, 'id'> & { id?: string }): User {
  const id = u.id || Math.random().toString(36).slice(2, 9);
  const user: User = { id, name: u.name, email: u.email, role: u.role || 'user' };
  users.set(id, user);
  return user;
}

export function deleteUser(id: string): boolean {
  return users.delete(id);
}

// seed a couple users for demo
createUser({ name: 'Admin User', email: 'admin@example.com', role: 'admin' });
createUser({ name: 'Example User', email: 'user@example.com' });
