import { describe, it, expect } from 'vitest';
describe('useAmenities', () => {
  it('exports hook', async () => {
    const m = await import('./useAmenities.js');
    expect(m.useAmenities).toBeDefined();
  });
});
