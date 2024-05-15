import { describe, it, expect } from 'vitest';
import type { Job } from './types.js';

describe('Job types', () => {
  it('Job shape', () => {
    const job: Job = {
      id: '1',
      name: 'test',
      data: {},
      status: 'waiting',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
    };
    expect(job.name).toBe('test');
  });
});
