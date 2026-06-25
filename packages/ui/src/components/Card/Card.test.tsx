import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('is a function component', () => {
    expect(typeof Card).toBe('function');
  });
});
