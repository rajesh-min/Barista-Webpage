import bcrypt from 'bcryptjs';
import { db, createId } from '../repositories/db.js';
import { signToken } from '../utils/jwt.js';

export async function register({ name, email, password, phone }) {
  const existing = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Email already registered');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = {
    id: createId('USR'),
    name,
    email,
    password_hash,
    phone,
    role: db.users.length === 0 ? 'admin' : 'user',
    created_at: new Date().toISOString()
  };

  db.users.push(user);
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function login({ email, password }) {
  const user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}
