import { describe, it, expect } from 'vitest';
describe('useDirectory', () => {
  it('exports hook', async () => {
    const m = await import('./useDirectory.js');
    expect(m.useDirectory).toBeDefined();
  });
});
