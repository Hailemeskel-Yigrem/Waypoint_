import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Integration routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('creates webhook integration', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/integrations',
      headers: { authorization: ctx.authToken },
      payload: {
        provider: 'webhook',
        name: 'Events',
        config: { url: 'https://hooks.example.com/w' },
      },
    });
    expect(res.statusCode).toBe(201);
  });
});
