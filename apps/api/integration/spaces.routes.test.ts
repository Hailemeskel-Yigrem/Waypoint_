import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Space routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('creates space with auth', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/spaces',
      headers: { authorization: ctx.authToken },
      payload: { name: 'HQ', type: 'office', capacity: 100 },
    });
    expect(res.statusCode).toBe(201);
  });
});
