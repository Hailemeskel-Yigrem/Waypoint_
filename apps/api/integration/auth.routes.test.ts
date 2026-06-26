import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';
import { TEST_PASSWORD } from '../tests/helpers/fixtures.js';

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
      payload: { email: 'user@acme.test', password: TEST_PASSWORD, organizationId: ctx.orgId },
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
