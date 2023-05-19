import { describe, it, expect, vi } from 'vitest';
import { InvoiceRepository } from './invoice-repository.js';
describe('InvoiceRepository', () => {
  it('constructs', () => {
    const db = { query: vi.fn(), close: vi.fn() };
    expect(new InvoiceRepository(db)).toBeDefined();
  });
});
