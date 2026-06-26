import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Access routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('creates access policy', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/access/policies',
      headers: { authorization: ctx.authToken },
      payload: { name: 'Allow all', action: 'book_desk', effect: 'allow', conditions: {} },
    });
    expect(res.statusCode).toBe(201);
  });
});
