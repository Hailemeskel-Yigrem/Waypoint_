import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from './helpers/setup.js';
import { apiMetrics } from '../src/modules/health/metrics.js';

describe('Health HTTP endpoints', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];

  afterEach(async () => {
    await app?.close();
    apiMetrics.reset();
  });

  it('GET /api/v1/health returns the liveness contract', async () => {
    ({ app } = await createTestApp());
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: expect.objectContaining({ status: 'ok' }),
    });
  });

  it('GET /api/v1/health/ready exposes dependency readiness', async () => {
    ({ app } = await createTestApp());
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health/ready?verbose=true',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({ ready: true, status: 'ok' });
  });

  it('GET /api/v1/metrics publishes Prometheus request counters', async () => {
    ({ app } = await createTestApp());
    await app.inject({ method: 'GET', url: '/api/v1/health' });
    const response = await app.inject({ method: 'GET', url: '/api/v1/metrics' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.body).toContain('waypoint_http_requests_total');
    expect(response.body).toContain('route="/api/v1/health"');
  });
});
