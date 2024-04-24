import { describe, it, expect } from 'vitest';
import { JOB_NAMES } from './registry.js';

describe('job registry', () => {
  it('defines job names', () => {
    expect(JOB_NAMES.BOOKING_REMINDER).toBe('booking-reminder');
    expect(JOB_NAMES.WEBHOOK_DELIVERY).toBe('webhook-delivery');
  });
});
