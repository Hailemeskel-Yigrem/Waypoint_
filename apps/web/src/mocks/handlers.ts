import type { Booking, Space, Visitor } from '@waypoint/shared';

export const mockSpaces: Space[] = [];
export const mockBookings: Booking[] = [];
export const mockVisitors: Visitor[] = [];

export function resetMocks(): void {
  mockSpaces.length = 0;
  mockBookings.length = 0;
  mockVisitors.length = 0;
}
