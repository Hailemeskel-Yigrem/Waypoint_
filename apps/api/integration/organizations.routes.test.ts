import { describe, it, expect, afterEach } from 'vitest';
import { createTestApp } from '../helpers/setup.js';

describe('Organization routes', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  afterEach(async () => {
    await app?.close();
  });

  it('creates and lists organizations', async () => {
    ({ app } = await createTestApp());
    const create = await app.inject({
      method: 'POST',
      url: '/api/v1/organizations',
      payload: { name: 'Waypoint Labs', slug: 'waypoint-labs' },
    });
    expect(create.statusCode).toBe(201);
    const list = await app.inject({ method: 'GET', url: '/api/v1/organizations' });
    expect(list.json().data.items.length).toBeGreaterThan(0);
  });
});
