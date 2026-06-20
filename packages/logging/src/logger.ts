import { LogLevels, parseLogLevel, shouldLog, type LogLevelName } from './levels.js';
import { serializeLogEntry } from './serializer.js';

export interface LoggerOptions {
  service?: string;
  level?: LogLevelName;
  bindings?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>, error?: Error): void;
  fatal(message: string, meta?: Record<string, unknown>, error?: Error): void;
  child(bindings: Record<string, unknown>): Logger;
}

type Writer = (line: string) => void;

export function createLogger(
  options: LoggerOptions = {},
  writer: Writer = (line) => console.log(line),
): Logger {
  const levelName = options.level ?? parseLogLevel(process.env.LOG_LEVEL ?? 'info');
  const minLevel = LogLevels[levelName];
  const service = options.service;
  const bindings = options.bindings ?? {};

  const log = (
    level: LogLevelName,
    message: string,
    meta?: Record<string, unknown>,
    error?: Error,
  ) => {
    if (!shouldLog(minLevel, LogLevels[level])) return;
    const merged = { ...bindings, ...meta };
    writer(
      serializeLogEntry(
        level,
        message,
        Object.keys(merged).length ? merged : undefined,
        service,
        error,
      ),
    );
  };

  return {
    debug: (m, meta) => log('debug', m, meta),
    info: (m, meta) => log('info', m, meta),
    warn: (m, meta) => log('warn', m, meta),
    error: (m, meta, err) => log('error', m, meta, err),
    fatal: (m, meta, err) => log('fatal', m, meta, err),
    child: (childBindings) =>
      createLogger(
        { service, level: levelName, bindings: { ...bindings, ...childBindings } },
        writer,
      ),
  };
}
