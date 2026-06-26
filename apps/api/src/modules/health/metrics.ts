export interface HttpRequestMeasurement {
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
}

interface HttpMetric {
  count: number;
  durationSeconds: number;
}

function escapeLabel(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n');
}

export class MetricsRegistry {
  private readonly requests = new Map<string, HttpMetric>();

  observeHttpRequest(measurement: HttpRequestMeasurement): void {
    const labels = [
      measurement.method.toUpperCase(),
      measurement.route,
      String(measurement.statusCode),
    ];
    const key = JSON.stringify(labels);
    const metric = this.requests.get(key) ?? { count: 0, durationSeconds: 0 };
    metric.count += 1;
    metric.durationSeconds += Math.max(0, measurement.durationMs) / 1000;
    this.requests.set(key, metric);
  }

  render(): string {
    const lines = [
      '# HELP waypoint_process_uptime_seconds API process uptime in seconds.',
      '# TYPE waypoint_process_uptime_seconds gauge',
      `waypoint_process_uptime_seconds ${process.uptime().toFixed(3)}`,
      '# HELP waypoint_http_requests_total Total HTTP requests handled by the API.',
      '# TYPE waypoint_http_requests_total counter',
      '# HELP waypoint_http_request_duration_seconds_sum Cumulative HTTP request duration.',
      '# TYPE waypoint_http_request_duration_seconds_sum counter',
    ];

    for (const [key, metric] of [...this.requests.entries()].sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      const [method = '', route = '', statusCode = ''] = JSON.parse(key) as string[];
      const labelSet = `method="${escapeLabel(method)}",route="${escapeLabel(route)}",status_code="${escapeLabel(statusCode)}"`;
      lines.push(`waypoint_http_requests_total{${labelSet}} ${metric.count}`);
      lines.push(
        `waypoint_http_request_duration_seconds_sum{${labelSet}} ${metric.durationSeconds.toFixed(6)}`,
      );
    }

    return `${lines.join('\n')}\n`;
  }

  reset(): void {
    this.requests.clear();
  }
}

export const apiMetrics = new MetricsRegistry();
