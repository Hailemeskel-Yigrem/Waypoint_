import type { LogEntry } from '../serializer.js';

export function formatPretty(entry: LogEntry): string {
  return `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.message}`;
}
