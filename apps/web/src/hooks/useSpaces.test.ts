import { describe, it, expect } from 'vitest';
describe('useSpaces', () => {
  it('exports hook', async () => {
    const m = await import('./useSpaces.js');
    expect(m.useSpaces).toBeDefined();
  });
});
