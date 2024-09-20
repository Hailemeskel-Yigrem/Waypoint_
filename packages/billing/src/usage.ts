import { getPlan, type PlanLimits } from './plans.js';

export interface UsageSnapshot {
  seats: number;
  buildings: number;
  bookingsThisMonth: number;
}

export interface LimitCheck {
  allowed: boolean;
  code: string;
  limit: number;
  current: number;
}

export function checkSeatLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
  const plan = getPlan(planCode);
  return {
    allowed: usage.seats <= plan.maxSeats,
    code: 'seats',
    limit: plan.maxSeats,
    current: usage.seats,
  };
}

export function checkBuildingLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
  const plan = getPlan(planCode);
  return {
    allowed: usage.buildings <= plan.maxBuildings,
    code: 'buildings',
    limit: plan.maxBuildings,
    current: usage.buildings,
  };
}

export function checkBookingLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
  const plan = getPlan(planCode);
  return {
    allowed: usage.bookingsThisMonth < plan.maxBookingsPerMonth,
    code: 'bookings',
    limit: plan.maxBookingsPerMonth,
    current: usage.bookingsThisMonth,
  };
}

export function assertWithinPlan(planCode: string, usage: UsageSnapshot): void {
  for (const check of [
    checkSeatLimit(planCode, usage),
    checkBuildingLimit(planCode, usage),
    checkBookingLimit(planCode, usage),
  ]) {
    if (!check.allowed) {
      throw new Error(`plan limit exceeded for ${check.code}: ${check.current}/${check.limit}`);
    }
  }
}

export function utilizationPercent(plan: PlanLimits, usage: UsageSnapshot): number {
  const seatPct = usage.seats / plan.maxSeats;
  const buildingPct = usage.buildings / plan.maxBuildings;
  const bookingPct = usage.bookingsThisMonth / plan.maxBookingsPerMonth;
  return Math.round(Math.max(seatPct, buildingPct, bookingPct) * 100);
}
