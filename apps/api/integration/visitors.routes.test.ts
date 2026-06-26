import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Visitor routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('registers expected visitor', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/visitors',
      headers: { authorization: ctx.authToken },
      payload: { hostUserId: ctx.userId, name: 'Guest', expectedArrival: new Date().toISOString() },
    });
    expect(res.statusCode).toBe(201);
  });
});
