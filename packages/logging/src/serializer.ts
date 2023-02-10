import type { LogLevelName } from './levels.js';
import { getCorrelationContext } from './correlation.js';

export interface LogEntry {
  level: LogLevelName;
  message: string;
  timestamp: string;
  service?: string;
  correlationId?: string;
  requestId?: string;
  orgId?: string;
  userId?: string;
  meta?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
}

export function serializeLogEntry(
  level: LogLevelName,
  message: string,
  meta?: Record<string, unknown>,
  service?: string,
  error?: Error,
): string {
  const ctx = getCorrelationContext();
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service,
    correlationId: ctx?.correlationId,
    requestId: ctx?.requestId,
    orgId: ctx?.orgId,
    userId: ctx?.userId,
    meta,
  };
  if (error) {
    entry.error = { name: error.name, message: error.message, stack: error.stack };
  }
  return JSON.stringify(entry);
}
