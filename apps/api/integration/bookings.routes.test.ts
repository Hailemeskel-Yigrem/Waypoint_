import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../tests/helpers/setup.js';

describe('Booking routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => {
    await ctx?.app.close();
  });

  it('rejects overlapping bookings via API', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({
      organizationId: ctx.orgId,
      name: 'S',
      type: 'office',
    });
    const desk = await ctx.repos.desks.create({
      organizationId: ctx.orgId,
      spaceId: space.id,
      label: 'D1',
    });
    const headers = { authorization: ctx.authToken };
    const payload = {
      deskId: desk.id,
      title: 'Work',
      startTime: '2026-06-01T09:00:00.000Z',
      endTime: '2026-06-01T12:00:00.000Z',
    };
    const first = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/bookings',
      headers,
      payload,
    });
    expect(first.statusCode).toBe(201);
    const second = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/bookings',
      headers,
      payload: {
        ...payload,
        title: 'Overlap',
        startTime: '2026-06-01T11:00:00.000Z',
        endTime: '2026-06-01T13:00:00.000Z',
      },
    });
    expect(second.statusCode).toBe(409);
  });

  it('rejects malformed booking ranges before reaching the service', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/bookings',
      headers: { authorization: ctx.authToken },
      payload: {
        deskId: 'desk-1',
        title: '',
        startTime: '2026-06-25T12:00:00.000Z',
        endTime: '2026-06-25T09:00:00.000Z',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error).toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
