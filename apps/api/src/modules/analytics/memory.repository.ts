import type { AnalyticsRepository } from './repository.js';
import type { DashboardSummary, AnalyticsQuery, OccupancyMetrics, VisitorMetrics, BookingMetrics } from './types.js';
import type { DeskRepository } from '../desks/repository.js';
import type { BookingRepository } from '../bookings/repository.js';
import type { VisitorRepository } from '../visitors/repository.js';
import type { UserRepository } from '../users/repository.js';
import type { SpaceRepository } from '../spaces/repository.js';

export class AnalyticsDataRepository implements AnalyticsRepository {
  constructor(
    private readonly desks: DeskRepository,
    private readonly bookings: BookingRepository,
    private readonly visitors: VisitorRepository,
    private readonly users: UserRepository,
    private readonly spaces: SpaceRepository,
  ) {}

  async getOccupancy(query: AnalyticsQuery): Promise<OccupancyMetrics> {
    const totalDesks = await this.desks.count(query.organizationId);
    const bookingResult = await this.bookings.list(query.organizationId, { page: 1, limit: 1000, sortOrder: 'desc' });
    const activeBookings = bookingResult.items.filter(
      (b) =>
        b.status !== 'cancelled' &&
        b.deskId &&
        b.startTime <= query.to &&
        b.endTime >= query.from,
    );
    const uniqueDesks = new Set(activeBookings.map((b) => b.deskId));
    const bookedDesks = uniqueDesks.size;
    return {
      organizationId: query.organizationId,
      date: query.to.toISOString().slice(0, 10),
      totalDesks,
      bookedDesks,
      occupancyRate: totalDesks > 0 ? bookedDesks / totalDesks : 0,
    };
  }

  async getVisitorMetrics(query: AnalyticsQuery): Promise<VisitorMetrics> {
    const result = await this.visitors.list(query.organizationId, { page: 1, limit: 1000, sortOrder: 'desc' });
    const inRange = result.items.filter(
      (v) => v.expectedArrival >= query.from && v.expectedArrival <= query.to,
    );
    const expected = inRange.length;
    const checkedIn = inRange.filter((v) => v.status === 'checked_in' || v.status === 'checked_out').length;
    const noShow = inRange.filter((v) => v.status === 'no_show').length;
    return {
      organizationId: query.organizationId,
      period: `${query.from.toISOString()}..${query.to.toISOString()}`,
      expected,
      checkedIn,
      noShow,
      checkInRate: expected > 0 ? checkedIn / expected : 0,
    };
  }

  async getBookingMetrics(query: AnalyticsQuery): Promise<BookingMetrics> {
    const result = await this.bookings.list(query.organizationId, { page: 1, limit: 1000, sortOrder: 'desc' });
    const inRange = result.items.filter(
      (b) => b.startTime >= query.from && b.startTime <= query.to,
    );
    const totalBookings = inRange.length;
    const cancelledBookings = inRange.filter((b) => b.status === 'cancelled').length;
    const durations = inRange
      .filter((b) => b.status !== 'cancelled')
      .map((b) => (b.endTime.getTime() - b.startTime.getTime()) / 60_000);
    const averageDurationMinutes =
      durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    return {
      organizationId: query.organizationId,
      period: `${query.from.toISOString()}..${query.to.toISOString()}`,
      totalBookings,
      cancelledBookings,
      averageDurationMinutes,
    };
  }

  async getDashboard(query: AnalyticsQuery): Promise<DashboardSummary> {
    const [occupancy, visitors, bookings, activeUsers, spaces] = await Promise.all([
      this.getOccupancy(query),
      this.getVisitorMetrics(query),
      this.getBookingMetrics(query),
      this.users.countActive(query.organizationId),
      this.spaces.list(query.organizationId, { page: 1, limit: 1000, sortOrder: 'desc' }),
    ]);

    return {
      organizationId: query.organizationId,
      generatedAt: new Date().toISOString(),
      occupancy,
      visitors,
      bookings,
      activeUsers,
      activeSpaces: spaces.items.filter((s) => s.isActive).length,
    };
  }
}
