import { describe, it, expect, vi } from 'vitest';
import { UserRepository } from './user-repository.js';
describe('UserRepository', () => {
  it('constructs', () => {
    const db = { query: vi.fn(), close: vi.fn() };
    expect(new UserRepository(db)).toBeDefined();
  });
});
