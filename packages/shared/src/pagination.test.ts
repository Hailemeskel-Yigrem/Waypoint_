import { describe, it, expect } from 'vitest';
import { paginate } from '../types/pagination.js';

describe('paginate', () => {
  it('paginates items', () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    const r = paginate(items, 2, 10);
    expect(r.items).toHaveLength(10);
    expect(r.totalPages).toBe(3);
  });
});
