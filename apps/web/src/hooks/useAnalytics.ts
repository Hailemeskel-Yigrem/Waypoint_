import { useEffect, useState } from 'react';
import { getAnalytics } from '../api/analytics.js';
import type { AnalyticsRollup } from '@waypoint/shared';

export function useAnalytics(days = 30) {
  const [data, setData] = useState<AnalyticsRollup[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAnalytics(days)
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);
  return { data, loading };
}
