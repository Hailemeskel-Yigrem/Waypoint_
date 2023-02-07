import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationContext {
  correlationId: string;
  requestId?: string;
  orgId?: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<CorrelationContext>();

export function runWithCorrelation<T>(ctx: CorrelationContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getCorrelationContext(): CorrelationContext | undefined {
  return storage.getStore();
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function createCorrelationId(): string {
  return crypto.randomUUID();
}
