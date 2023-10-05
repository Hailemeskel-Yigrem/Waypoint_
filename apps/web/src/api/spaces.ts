import { apiRequest } from './client.js';
import type { Space, Desk, CreateSpaceInput } from '@waypoint/shared';

export async function listSpaces(): Promise<Space[]> {
  const res = await apiRequest<{ data: Space[] }>('/spaces');
  return res.data;
}

export async function createSpace(input: CreateSpaceInput): Promise<Space> {
  const res = await apiRequest<{ data: Space }>('/spaces', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function listDesks(spaceId?: string): Promise<Desk[]> {
  const q = spaceId ? `?spaceId=${spaceId}` : '';
  const res = await apiRequest<{ data: Desk[] }>(`/desks${q}`);
  return res.data;
}
