import { describe, it, expect, vi } from 'vitest';
import { SpaceRepository } from './space-repository.js';
describe('SpaceRepository', () => {
  it('constructs', () => {
    const db = { query: vi.fn(), close: vi.fn() };
    expect(new SpaceRepository(db)).toBeDefined();
  });
});
