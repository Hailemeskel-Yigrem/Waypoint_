export interface OccupancyMetrics {
  organizationId: string;
  date: string;
  totalDesks: number;
  bookedDesks: number;
  occupancyRate: number;
}

export interface VisitorMetrics {
  organizationId: string;
  period: string;
  expected: number;
  checkedIn: number;
  noShow: number;
  checkInRate: number;
}

export interface BookingMetrics {
  organizationId: string;
  period: string;
  totalBookings: number;
  cancelledBookings: number;
  averageDurationMinutes: number;
}

export interface DashboardSummary {
  organizationId: string;
  generatedAt: string;
  occupancy: OccupancyMetrics;
  visitors: VisitorMetrics;
  bookings: BookingMetrics;
  activeUsers: number;
  activeSpaces: number;
}

export interface AnalyticsQuery {
  organizationId: string;
  from: Date;
  to: Date;
}
