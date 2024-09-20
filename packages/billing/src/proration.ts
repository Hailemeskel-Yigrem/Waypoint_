export function daysInclusive(startIso: string, endIso: string): number {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    throw new Error('invalid proration range');
  }
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function prorateAmountCents(
  monthlyAmountCents: number,
  periodStart: string,
  periodEnd: string,
  monthDays = 30,
): number {
  const days = daysInclusive(periodStart, periodEnd);
  return Math.round((monthlyAmountCents * days) / monthDays);
}
