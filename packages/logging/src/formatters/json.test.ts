import { describe, it, expect } from 'vitest';
import { formatLogEntry } from './json.js';

describe('json formatter', () => {
  it('formats entry', () => {
    const s = formatLogEntry({ level: 'info', message: 'hi', timestamp: '2026-01-01T00:00:00Z' });
    expect(JSON.parse(s).message).toBe('hi');
  });
});
