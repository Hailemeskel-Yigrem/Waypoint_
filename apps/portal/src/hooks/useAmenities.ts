import { useCallback, useEffect, useState } from 'react';
import { listAmenities } from '../api/amenities.js';
import type { Amenity } from '@waypoint/shared';

export function useAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listAmenities()
      .then(setAmenities)
      .finally(() => setLoading(false));
  }, []);
  const refresh = useCallback(() => listAmenities().then(setAmenities), []);
  return { amenities, loading, refresh };
}
