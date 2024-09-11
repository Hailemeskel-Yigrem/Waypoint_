export interface PlanLimits {
  code: string;
  maxSeats: number;
  maxBuildings: number;
  maxBookingsPerMonth: number;
  priceUsdMonthly: number;
  features: string[];
}

export const PLANS: Record<string, PlanLimits> = {
  starter: {
    code: 'starter',
    maxSeats: 25,
    maxBuildings: 5,
    maxBookingsPerMonth: 50,
    priceUsdMonthly: 0,
    features: ['bookings', 'visitors'],
  },
  growth: {
    code: 'growth',
    maxSeats: 100,
    maxBuildings: 25,
    maxBookingsPerMonth: 250,
    priceUsdMonthly: 49,
    features: ['bookings', 'visitors', 'amenities', 'analytics'],
  },
  business: {
    code: 'business',
    maxSeats: 500,
    maxBuildings: 100,
    maxBookingsPerMonth: 2000,
    priceUsdMonthly: 149,
    features: ['bookings', 'visitors', 'amenities', 'analytics', 'webhooks', 'sso'],
  },
  enterprise: {
    code: 'enterprise',
    maxSeats: 10000,
    maxBuildings: 1000,
    maxBookingsPerMonth: 50000,
    priceUsdMonthly: 399,
    features: ['bookings', 'visitors', 'amenities', 'analytics', 'webhooks', 'sso', 'sla', 'audit'],
  },
};

export function getPlan(code: string): PlanLimits {
  const plan = PLANS[code];
  if (!plan) throw new Error(`unknown plan: ${code}`);
  return plan;
}
