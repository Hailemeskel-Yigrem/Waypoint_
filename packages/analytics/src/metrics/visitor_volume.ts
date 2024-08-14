export interface VisitorVolumeSample {
  organizationId: string;
  timestamp: string;
  value: number;
  dimensions?: Record<string, string>;
}

export function aggregateVisitorVolume(samples: VisitorVolumeSample[]): {
  average: number;
  max: number;
  min: number;
  count: number;
} {
  if (samples.length === 0) {
    return { average: 0, max: 0, min: 0, count: 0 };
  }
  const values = samples.map((s) => s.value);
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    average: sum / values.length,
    max: Math.max(...values),
    min: Math.min(...values),
    count: values.length,
  };
}

export function normalizeVisitorVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}
