import { apiRequest } from './client.js';
import type { Amenity } from '@waypoint/shared';

export async function listAmenities(): Promise<Amenity[]> {
  const res = await apiRequest<{ data: Amenity[] }>('/amenities');
  return res.data;
}
