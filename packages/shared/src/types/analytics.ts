import type { EntityId, OrgId } from './id.js';

export interface AnalyticsRollup {
  id: EntityId;
  orgId: OrgId;
  date: string;
  bookingsCount: number;
  visitorsCount: number;
  occupancyRate: number;
  peakHour: number;
  revenueCents: number;
}
