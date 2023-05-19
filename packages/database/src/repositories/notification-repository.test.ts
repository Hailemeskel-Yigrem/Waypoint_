import { describe, it, expect, vi } from 'vitest';
import { NotificationRepository } from './notification-repository.js';
describe('NotificationRepository', () => {
  it('constructs', () => {
    const db = { query: vi.fn(), close: vi.fn() };
    expect(new NotificationRepository(db)).toBeDefined();
  });
});
