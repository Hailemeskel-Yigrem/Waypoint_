import type { DashboardSummary, AnalyticsQuery, OccupancyMetrics, VisitorMetrics, BookingMetrics } from './types.js';

export interface AnalyticsRepository {
  getDashboard(query: AnalyticsQuery): Promise<DashboardSummary>;
  getOccupancy(query: AnalyticsQuery): Promise<OccupancyMetrics>;
  getVisitorMetrics(query: AnalyticsQuery): Promise<VisitorMetrics>;
  getBookingMetrics(query: AnalyticsQuery): Promise<BookingMetrics>;
}
