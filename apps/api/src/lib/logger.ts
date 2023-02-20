import pino from 'pino';
import type { Logger } from 'pino';

export type { Logger };

export function createLogger(options: { level: string; pretty: boolean }): Logger {
  if (options.pretty) {
    return pino({
      level: options.level,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      },
    });
  }

  return pino({
    level: options.level,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export function childLogger(parent: Logger, bindings: Record<string, unknown>): Logger {
  return parent.child(bindings);
}
