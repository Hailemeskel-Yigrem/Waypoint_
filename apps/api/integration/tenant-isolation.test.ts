import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext, seedOrganization, seedUser, authHeader } from '../helpers/setup.js';

describe('Tenant isolation', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('cannot access another org spaces', async () => {
    ctx = await seedTestContext();
    const otherOrg = await seedOrganization(ctx.repos, 'other-corp');
    const space = await ctx.repos.spaces.create({
      organizationId: otherOrg,
      name: 'Secret',
      type: 'office',
    });
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/spaces/${space.id}`,
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(404);
  });
});
