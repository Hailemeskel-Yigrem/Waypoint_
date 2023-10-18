import { useCallback, useEffect, useState } from 'react';
import { listBookings, createBooking, cancelBooking } from '../api/bookings.js';
import type { Booking, CreateBookingInput } from '@waypoint/shared';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await listBookings());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreateBookingInput) => {
    const b = await createBooking(input);
    setBookings((prev) => [...prev, b]);
    return b;
  }, []);

  const cancel = useCallback(async (id: string) => {
    await cancelBooking(id);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)),
    );
  }, []);

  return { bookings, loading, error, refresh, create, cancel };
}
