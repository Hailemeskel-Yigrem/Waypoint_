import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Auth routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('logs in with valid credentials', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'user@acme.test', password: 'password123', organizationId: ctx.orgId },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.token).toBeDefined();
  });

  it('rejects protected route without token', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/spaces' });
    expect(res.statusCode).toBe(401);
  });
});
