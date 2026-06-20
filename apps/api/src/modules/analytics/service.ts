import { ok, type Result } from '../../lib/result.js';
import type { AnalyticsRepository } from './repository.js';
import type {
  DashboardSummary,
  AnalyticsQuery,
  OccupancyMetrics,
  VisitorMetrics,
  BookingMetrics,
} from './types.js';

export class AnalyticsService {
  constructor(private readonly repo: AnalyticsRepository) {}

  private defaultRange(): { from: Date; to: Date } {
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);
    return { from, to };
  }

  buildQuery(organizationId: string, from?: Date, to?: Date): AnalyticsQuery {
    const defaults = this.defaultRange();
    return {
      organizationId,
      from: from ?? defaults.from,
      to: to ?? defaults.to,
    };
  }

  async dashboard(
    organizationId: string,
    from?: Date,
    to?: Date,
  ): Promise<Result<DashboardSummary>> {
    const summary = await this.repo.getDashboard(this.buildQuery(organizationId, from, to));
    return ok(summary);
  }

  async occupancy(
    organizationId: string,
    from?: Date,
    to?: Date,
  ): Promise<Result<OccupancyMetrics>> {
    return ok(await this.repo.getOccupancy(this.buildQuery(organizationId, from, to)));
  }

  async visitors(organizationId: string, from?: Date, to?: Date): Promise<Result<VisitorMetrics>> {
    return ok(await this.repo.getVisitorMetrics(this.buildQuery(organizationId, from, to)));
  }

  async bookings(organizationId: string, from?: Date, to?: Date): Promise<Result<BookingMetrics>> {
    return ok(await this.repo.getBookingMetrics(this.buildQuery(organizationId, from, to)));
  }
}
