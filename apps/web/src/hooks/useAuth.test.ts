import { describe, it, expect } from 'vitest';
describe('useAuth', () => {
  it('exports hook', async () => {
    const m = await import('./useAuth.js');
    expect(m.useAuth).toBeDefined();
  });
});
