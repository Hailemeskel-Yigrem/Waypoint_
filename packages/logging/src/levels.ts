export const LogLevels = { debug: 10, info: 20, warn: 30, error: 40, fatal: 50 } as const;
export type LogLevelName = keyof typeof LogLevels;
export type LogLevelValue = (typeof LogLevels)[LogLevelName];

export function parseLogLevel(input: string): LogLevelName {
  const normalized = input.toLowerCase();
  if (normalized in LogLevels) return normalized as LogLevelName;
  return 'info';
}

export function shouldLog(current: LogLevelValue, message: LogLevelValue): boolean {
  return message >= current;
}
