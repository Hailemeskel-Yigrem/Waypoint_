import { beforeEach, describe, expect, it } from 'vitest';
import { MetricsRegistry } from './metrics.js';

describe('MetricsRegistry', () => {
  let metrics: MetricsRegistry;

  beforeEach(() => {
    metrics = new MetricsRegistry();
  });

  it('aggregates request counts and durations by bounded route labels', () => {
    metrics.observeHttpRequest({
      method: 'get',
      route: '/spaces/:spaceId',
      statusCode: 200,
      durationMs: 10,
    });
    metrics.observeHttpRequest({
      method: 'GET',
      route: '/spaces/:spaceId',
      statusCode: 200,
      durationMs: 15,
    });

    const output = metrics.render();
    expect(output).toContain(
      'waypoint_http_requests_total{method="GET",route="/spaces/:spaceId",status_code="200"} 2',
    );
    expect(output).toContain(
      'waypoint_http_request_duration_seconds_sum{method="GET",route="/spaces/:spaceId",status_code="200"} 0.025000',
    );
  });
});
