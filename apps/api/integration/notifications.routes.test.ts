import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Notification routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('lists my notifications', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET', url: '/api/v1/notifications/me',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
  });
});

