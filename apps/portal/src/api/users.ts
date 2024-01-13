import { apiRequest } from './client.js';
import type { UserProfile } from '@waypoint/shared';

export async function listUsers(): Promise<UserProfile[]> {
  const res = await apiRequest<{ data: UserProfile[] }>('/users');
  return res.data;
}

export async function getDirectory(): Promise<UserProfile[]> {
  const res = await apiRequest<{ data: UserProfile[] }>('/directory');
  return res.data;
}
