import { describe, it, expect } from 'vitest';
describe('useBookings', () => {
  it('exports hook', async () => {
    const m = await import('./useBookings.js');
    expect(m.useBookings).toBeDefined();
  });
});
