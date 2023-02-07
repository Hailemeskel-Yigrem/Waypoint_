import type { LogEntry } from '../serializer.js';

export function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}
