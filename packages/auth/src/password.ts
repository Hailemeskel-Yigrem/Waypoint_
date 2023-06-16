import bcrypt from 'bcryptjs';
import { ok, err, type Result } from '@waypoint/shared';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(password: string): Result<string, string> {
  if (password.length < 8) return err('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) return err('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) return err('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) return err('Password must contain a number');
  return ok(password);
}
