import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Directory routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('creates directory entry', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/directory',
      headers: { authorization: ctx.authToken },
      payload: { displayName: 'Alex', email: 'alex@acme.test' },
    });
    expect(res.statusCode).toBe(201);
  });
});
