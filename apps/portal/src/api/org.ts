import { apiRequest } from './client.js';
import type { Organization, UpdateOrgInput } from '@waypoint/shared';

export async function getOrg(): Promise<Organization> {
  const res = await apiRequest<{ data: Organization }>('/org');
  return res.data;
}

export async function updateOrg(input: UpdateOrgInput): Promise<Organization> {
  const res = await apiRequest<{ data: Organization }>('/org', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return res.data;
}
