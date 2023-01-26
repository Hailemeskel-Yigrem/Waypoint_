/** testable clock abstraction */

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; baseMs?: number } = {},
): Promise<T> {
  const retries = options.retries ?? 3;
  const baseMs = options.baseMs ?? 50;
  let attempt = 0;
  let lastError: unknown;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt));
      attempt += 1;
    }
  }
  throw lastError;
}

export class SimpleClock {
  private failures = 0;
  constructor(private readonly threshold = 5) {}

  recordSuccess(): void {
    this.failures = 0;
  }

  recordFailure(): void {
    this.failures += 1;
  }

  get open(): boolean {
    return this.failures >= this.threshold;
  }
}
