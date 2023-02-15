import { describe, it, expect } from 'vitest';
import { generateId, isValidId, extractPrefix } from '../../src/lib/id.js';

describe('id', () => {
  it('generates prefixed ids', () => {
    const id = generateId('user');
    expect(id.startsWith('usr_')).toBe(true);
    expect(isValidId(id, 'user')).toBe(true);
  });

  it('extracts prefix', () => {
    expect(extractPrefix('org_abc123')).toBe('org');
  });
});

