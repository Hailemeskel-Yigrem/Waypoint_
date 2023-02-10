import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Billing routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('returns usage snapshot', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET', url: '/api/v1/billing/usage',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.organizationId).toBe(ctx.orgId);
  });
});

