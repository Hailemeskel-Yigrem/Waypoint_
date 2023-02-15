import { describe, it, expect } from 'vitest';
import { paginate, offsetFromPage, sortItems } from '../../src/lib/pagination.js';

describe('pagination', () => {
  it('computes offset from page', () => {
    expect(offsetFromPage(3, 20)).toBe(40);
  });

  it('paginates items', () => {
    const result = paginate([1, 2], 1, 20, 2);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([1, 2]);
  });

  it('sorts items asc/desc', () => {
    const items = [{ n: 3 }, { n: 1 }];
    expect(sortItems(items, 'n', 'asc').map((i) => i.n)).toEqual([1, 3]);
  });
});

