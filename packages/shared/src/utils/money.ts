export interface Money {
  amountCents: number;
  currency: string;
}

export function money(amountCents: number, currency = 'USD'): Money {
  return { amountCents: Math.round(amountCents), currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  return money(a.amountCents + b.amountCents, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  return money(a.amountCents - b.amountCents, a.currency);
}

export function multiplyMoney(m: Money, factor: number): Money {
  return money(Math.round(m.amountCents * factor), m.currency);
}

export function formatMoney(m: Money, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
  }).format(m.amountCents / 100);
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function sumMoney(items: Money[]): Money {
  if (items.length === 0) return money(0);
  const currency = items[0]!.currency;
  const total = items.reduce((acc, item) => {
    if (item.currency !== currency) throw new Error('Currency mismatch in sum');
    return acc + item.amountCents;
  }, 0);
  return money(total, currency);
}
