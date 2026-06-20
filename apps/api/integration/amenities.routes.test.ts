import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Amenity routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('creates amenity', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({
      organizationId: ctx.orgId,
      name: 'Gym Zone',
      type: 'zone',
    });
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/amenities',
      headers: { authorization: ctx.authToken },
      payload: { spaceId: space.id, name: 'Fitness Center', type: 'gym', capacity: 20 },
    });
    expect(res.statusCode).toBe(201);
  });
});
