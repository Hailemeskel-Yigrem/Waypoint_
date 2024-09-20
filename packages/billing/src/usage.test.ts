import { describe, it, expect } from 'vitest';
import { assertWithinPlan, checkSeatLimit, utilizationPercent } from './usage.js';
import { getPlan } from './plans.js';

describe('billing usage', () => {
  it('allows usage under limits', () => {
    const check = checkSeatLimit('growth', { seats: 10, buildings: 2, bookingsThisMonth: 5 });
    expect(check.allowed).toBe(true);
  });

  it('blocks seat overage', () => {
    expect(() =>
      assertWithinPlan('starter', { seats: 30, buildings: 1, bookingsThisMonth: 1 }),
    ).toThrow(/seats/);
  });

  it('computes utilization', () => {
    const plan = getPlan('growth');
    const pct = utilizationPercent(plan, { seats: 50, buildings: 5, bookingsThisMonth: 25 });
    expect(pct).toBe(50);
  });
});
