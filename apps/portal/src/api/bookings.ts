import { apiRequest } from './client.js';
import type { Booking, CreateBookingInput } from '@waypoint/shared';

export async function listBookings(): Promise<Booking[]> {
  const res = await apiRequest<{ data: Booking[] }>('/bookings');
  return res.data;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const res = await apiRequest<{ data: Booking }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function cancelBooking(id: string): Promise<void> {
  await apiRequest(`/bookings/${id}/cancel`, { method: 'POST' });
}
