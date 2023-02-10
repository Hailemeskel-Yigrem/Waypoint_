import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Desk routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates desk under space', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({ organizationId: ctx.orgId, name: 'Floor', type: 'floor' });
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/desks',
      headers: { authorization: ctx.authToken },
      payload: { spaceId: space.id, label: 'D-42' },
    });
    expect(res.statusCode).toBe(201);
  });
});

