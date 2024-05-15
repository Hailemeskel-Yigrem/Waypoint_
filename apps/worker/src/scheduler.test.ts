import { describe, it, expect, vi, afterEach } from 'vitest';
import { WorkerScheduler } from './scheduler.js';
import { MemoryQueueAdapter } from './queue/memory-adapter.js';

describe('WorkerScheduler', () => {
  afterEach(() => vi.useRealTimers());

  it('schedules rollup', () => {
    vi.useFakeTimers();
    const queue = new MemoryQueueAdapter();
    const add = vi.spyOn(queue, 'add');
    const scheduler = new WorkerScheduler(queue);
    scheduler.scheduleDailyRollup({ orgId: 'o1', intervalMs: 1000 });
    vi.advanceTimersByTime(1000);
    expect(add).toHaveBeenCalled();
    scheduler.stop();
  });
});
