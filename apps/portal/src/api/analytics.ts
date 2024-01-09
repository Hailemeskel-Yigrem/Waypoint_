import { apiRequest } from './client.js';
import type { AnalyticsRollup } from '@waypoint/shared';

export async function getAnalytics(days = 30): Promise<AnalyticsRollup[]> {
  const res = await apiRequest<{ data: AnalyticsRollup[] }>(`/analytics?days=${days}`);
  return res.data;
}
