import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Analytics routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('returns dashboard', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/analytics/dashboard',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
  });
});
