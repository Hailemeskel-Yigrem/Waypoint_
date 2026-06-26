import { describe, it, expect, afterEach } from 'vitest';
import { createTestApp } from '../tests/helpers/setup.js';
import { apiMetrics } from '../src/modules/health/metrics.js';

describe('Health routes', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  afterEach(async () => {
    await app?.close();
    apiMetrics.reset();
  });

  it('GET /api/v1/health', async () => {
    ({ app } = await createTestApp());
    const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.status).toBe('ok');
  });

  it('GET /api/v1/health/ready reports dependency readiness', async () => {
    ({ app } = await createTestApp());
    const res = await app.inject({ method: 'GET', url: '/api/v1/health/ready?verbose=true' });

    expect(res.statusCode).toBe(200);
    expect(res.json().data).toMatchObject({ ready: true, status: 'ok' });
  });

  it('GET /api/v1/metrics exposes Prometheus request metrics', async () => {
    ({ app } = await createTestApp());
    await app.inject({ method: 'GET', url: '/api/v1/health' });
    const res = await app.inject({ method: 'GET', url: '/api/v1/metrics' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.body).toContain('waypoint_http_requests_total');
    expect(res.body).toContain('route="/api/v1/health"');
  });
});
