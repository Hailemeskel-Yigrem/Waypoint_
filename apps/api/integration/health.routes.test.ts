import { describe, it, expect, afterEach } from 'vitest';
import { createTestApp } from '../helpers/setup.js';

describe('Health routes', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  afterEach(async () => {
    await app?.close();
  });

  it('GET /api/v1/health', async () => {
    ({ app } = await createTestApp());
    const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.status).toBe('ok');
  });
});
