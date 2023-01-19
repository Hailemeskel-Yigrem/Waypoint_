import { describe, it, expect } from 'vitest';
import { money, addMoney, formatMoney, sumMoney, dollarsToCents } from '../utils/money.js';

describe('money utils', () => {
  it('creates money', () => {
    expect(money(1000)).toEqual({ amountCents: 1000, currency: 'USD' });
  });
  it('adds money', () => {
    expect(addMoney(money(100), money(50)).amountCents).toBe(150);
  });
  it('formats money', () => {
    expect(formatMoney(money(1099))).toContain('10.99');
  });
  it('sums money', () => {
    expect(sumMoney([money(100), money(200)]).amountCents).toBe(300);
  });
  it('dollarsToCents', () => {
    expect(dollarsToCents(19.99)).toBe(1999);
  });
});
