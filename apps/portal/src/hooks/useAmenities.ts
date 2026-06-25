import { useCallback, useEffect, useState } from 'react';
import { listAmenities } from '../api/amenities.js';
import type { Amenity } from '@waypoint/shared';

export function useAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAmenities(await listAmenities());
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error('Failed to load amenities'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { amenities, loading, error, refresh };
}
