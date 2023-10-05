import { describe, it, expect } from 'vitest';
import { ApiError } from './client.js';

describe('ApiError', () => {
  it('stores status', () => {
    const e = new ApiError(404, 'Not found');
    expect(e.status).toBe(404);
  });
});
