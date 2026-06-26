import { beforeEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.js';
import {
  createMemoryRepositories,
  wireRepositories,
  type Repositories,
} from '../../src/modules/index.js';
import { hashPassword } from '../../src/lib/crypto.js';
import { encodeJwt } from '../../src/middleware/auth.js';
import type { AuthContext } from '../../src/lib/types.js';
import { resetConfig } from '../../src/config/index.js';
import { TEST_PASSWORD } from './fixtures.js';

process.env.NODE_ENV = 'test';
process.env.USE_MEMORY_REPOS = 'true';
process.env.JWT_SECRET = 'test-jwt-secret-min-16-chars';
process.env.LOG_PRETTY = 'false';

export interface TestContext {
  app: FastifyInstance;
  repos: Repositories;
  orgId: string;
  userId: string;
  authToken: string;
}

export async function createTestApp(): Promise<{ app: FastifyInstance; repos: Repositories }> {
  resetConfig();
  const repos = wireRepositories(createMemoryRepositories());
  const app = await buildApp({ repos });
  await app.ready();
  return { app, repos };
}

export async function seedOrganization(repos: Repositories, slug = 'acme'): Promise<string> {
  const org = await repos.organizations.create({ name: 'Acme Corp', slug, plan: 'starter' });
  return org.id;
}

export async function seedUser(
  repos: Repositories,
  organizationId: string,
  overrides: Partial<{
    email: string;
    name: string;
    role: AuthContext['role'];
    password: string;
  }> = {},
): Promise<{ userId: string; email: string }> {
  const email = overrides.email ?? 'user@acme.test';
  const user = await repos.users.create({
    organizationId,
    email,
    name: overrides.name ?? 'Test User',
    role: overrides.role ?? 'admin',
    passwordHash: hashPassword(overrides.password ?? TEST_PASSWORD),
  });
  await repos.users.update(organizationId, user.id, { status: 'active' });
  return { userId: user.id, email };
}

export function authHeader(auth: AuthContext, secret = process.env.JWT_SECRET!): string {
  return `Bearer ${encodeJwt(auth, secret)}`;
}

export async function seedTestContext(): Promise<TestContext> {
  const { app, repos } = await createTestApp();
  const orgId = await seedOrganization(repos);
  const { userId, email } = await seedUser(repos, orgId);
  const authToken = authHeader({
    userId,
    organizationId: orgId,
    role: 'admin',
    email,
  });
  return { app, repos, orgId, userId, authToken };
}

export function useFreshRepos(): Repositories {
  let repos: Repositories;
  beforeEach(() => {
    repos = wireRepositories(createMemoryRepositories());
  });
  return new Proxy({} as Repositories, {
    get(_target, prop) {
      return repos[prop as keyof Repositories];
    },
  });
}
