import type { Timestamps, UserRole } from '../../lib/types.js';

export type UserStatus = 'active' | 'inactive' | 'invited';

export interface User extends Timestamps {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string | null;
  apiKeyHash: string | null;
}

export interface CreateUserInput {
  organizationId: string;
  email: string;
  name: string;
  role?: UserRole;
  password?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  organizationId: string;
}

export interface AuthTokenResponse {
  token: string;
  user: Omit<User, 'passwordHash' | 'apiKeyHash'>;
}
